// src/contexts/PwaInstallContext.tsx
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

interface PwaInstallContextType {
    isInstallable: boolean;
    isInstalled: boolean;
    promptInstall: () => Promise<"accepted" | "dismissed" | null>;
}

const PwaInstallContext = createContext<PwaInstallContextType>({
    isInstallable: false,
    isInstalled: false,
    promptInstall: async () => null,
});

export function PwaInstallProvider({ children }: { children: ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState<boolean>(false);

    useEffect(() => {
        // 1. Check if already installed / standalone mode
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
        }

        // 2. Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        // 3. Listen for appinstalled event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | null> => {
        if (!deferredPrompt) {
            return null;
        }

        try {
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === "accepted") {
                setIsInstalled(true);
            }
            setDeferredPrompt(null);
            return choiceResult.outcome;
        } catch (err) {
            console.error("PWA install prompt error:", err);
            return null;
        }
    }, [deferredPrompt]);

    return (
        <PwaInstallContext.Provider
            value={{
                isInstallable: !!deferredPrompt && !isInstalled,
                isInstalled,
                promptInstall,
            }}
        >
            {children}
        </PwaInstallContext.Provider>
    );
}

export function usePwaInstall() {
    return useContext(PwaInstallContext);
}

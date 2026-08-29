// src/registerServiceWorker.ts

export function registerServiceWorker() {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("Dira PWA ServiceWorker registered with scope:", registration.scope);
                })
                .catch((error) => {
                    console.warn("Dira PWA ServiceWorker registration failed:", error);
                });
        });
    }
}

import { useState } from "react";
import { Button } from "../../components/ui/Buttons";
import { TextInput } from "../../components/ui/TextInput";
import ProfilePictureEditor from "../../components/ui/PictureCroper";
import { Modal, ModalHeader, ModalBody } from "../../components/ui/Modal";

const settingsSections = [
    { id: "general", label: "General", icon: "bi-gear" },
    { id: "profile", label: "Profile", icon: "bi-person" },
    { id: "notifications", label: "Notifications", icon: "bi-bell" },
    { id: "security", label: "Security", icon: "bi-shield-lock" },
    { id: "billing", label: "Billing", icon: "bi-credit-card" },
];

export function Settings() {
    const [activeSection, setActiveSection] = useState("general");
    const [openPictureEditor, setOpenPictureEditor] = useState(false);

    return (
        <div className="flex-1 text-main-700">
            <h3 className="text font-bold mb-6">Settings</h3>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Settings Navigation */}
                <div className="w-full md:w-64 bg-main-100 rounded-lg shadow-sm border border-main-200 p-2 h-fit">
                    {settingsSections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors
                                ${activeSection === section.id
                                    ? "bg-primary text-white"
                                    : "hover:bg-main-200 text-main-700"}`}
                        >
                            <i className={`bi ${section.icon}`} />
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="flex-1 bg-main-100 rounded-lg shadow-sm border border-main-200 p-6">
                    {activeSection === "general" && (
                        <div>
                            <h4 className="text-lg font-semibold mb-4">General Settings</h4>
                            <div className="space-y-4">
                                <TextInput label="Company Name" labelBgColor="bg-main-100" color="primary" size="md" rounded="md"
                                    value="Stationery Store" />
                                <TextInput label="Business Email" labelBgColor="bg-main-100" color="primary" size="md" rounded="md" type="email"
                                    value="contact@stationery.com" />
                                <TextInput label="Phone Number" labelBgColor="bg-main-100" color="primary" size="md" rounded="md"
                                    value="+1 (555) 123-4567" />
                                <TextInput label="Address" labelBgColor="bg-main-100" color="primary" size="md" rounded="md"
                                    value="123 Business St, City" />
                                <div className="flex justify-end pt-4">
                                    <Button color="primary" size="sm" rounded="md">
                                        <i className="bi bi-check-lg mr-2" />Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "profile" && (
                        <>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Profile Settings</h4>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                                        <i className="bi bi-person text-primary text-3xl" />
                                    </div>
                                    <Button color="primary" size="sm" variant="outline" rounded="md" onClick={() => setOpenPictureEditor(true)}>Change Photo</Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <TextInput label="First Name" labelBgColor="bg-main-100" color="primary" size="md" rounded="md" />
                                        <TextInput label="Last Name" labelBgColor="bg-main-100" color="primary" size="md" rounded="md" />
                                    </div>
                                    <TextInput label="Email" labelBgColor="bg-main-100" color="primary" size="md" rounded="md" type="email" />
                                </div>
                            </div>
                            <Modal open={openPictureEditor} onClose={() => setOpenPictureEditor(false)} size="xl" blur={false}>
                                <ModalHeader
                                    title="Edit Profile Picture"
                                    icon="bi-person-bounding-box"
                                    onClose={() => setOpenPictureEditor(false)}
                                />
                                <ModalBody>
                                    <ProfilePictureEditor />
                                </ModalBody>
                            </Modal>
                        </>
                    )}

                    {activeSection === "notifications" && (
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Notification Preferences</h4>
                            <div className="space-y-4">
                                {["Email notifications", "Push notifications", "SMS alerts", "Weekly digest", "Sales alerts"].map(item => (
                                    <div key={item} className="flex items-center justify-between p-4 bg-main-50 rounded-md">
                                        <span>{item}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-main-300 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === "security" && (
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Security Settings</h4>
                            <div className="space-y-4">
                                <TextInput label="Current Password" labelBgColor="bg-main-100" color="primary" size="md" rounded="md" type="password" />
                                <TextInput label="New Password" labelBgColor="bg-main-100" color="primary" size="md" rounded="md" type="password" />
                                <TextInput label="Confirm Password" labelBgColor="bg-main-100" color="primary" size="md" rounded="md" type="password" />
                                <div className="flex justify-end pt-4">
                                    <Button color="primary" size="sm" rounded="md">Update Password</Button>
                                </div>
                            </div>
                            <div className="mt-8 p-4 bg-main-50 rounded-md">
                                <h5 className="font-medium mb-2">Two-Factor Authentication</h5>
                                <p className="text-sm text-main-500 mb-3">Add an extra layer of security to your account.</p>
                                <Button color="primary" size="sm" variant="outline" rounded="md">Enable 2FA</Button>
                            </div>
                        </div>
                    )}

                    {activeSection === "billing" && (
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Billing & Subscription</h4>
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Pro Plan</p>
                                        <p className="text-sm text-main-500">$49/month • Renews Jan 15, 2026</p>
                                    </div>
                                    <Button color="primary" size="sm" variant="outline" rounded="md">Manage Plan</Button>
                                </div>
                            </div>
                            <h5 className="font-medium mb-3">Payment Method</h5>
                            <div className="flex items-center gap-3 p-4 bg-main-50 rounded-md">
                                <i className="bi bi-credit-card text-2xl" />
                                <div>
                                    <p className="font-medium">•••• •••• •••• 4242</p>
                                    <p className="text-sm text-main-500">Expires 12/27</p>
                                </div>
                                <Button color="neutral" size="xs" variant="text" className="ml-auto">Edit</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


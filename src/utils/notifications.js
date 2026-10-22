import { toast } from "react-toastify";

const SUCCESS_PATTERN = /success|created|updated|saved|deleted|uploaded|registered|marked as paid|imported/i;

export function notify(message) {
    const text = String(message ?? "").trim();
    if (!text) return;

    if (SUCCESS_PATTERN.test(text)) {
        toast.success(text);
    } else {
        toast.error(text);
    }
}

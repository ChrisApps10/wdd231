export function initializeModal(modalId, closeButtonId, contentContainerId) {
    const modalElement = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeButtonId);
    const contentContainer = document.getElementById(contentContainerId);

    if (closeBtn && modalElement) {
        closeBtn.addEventListener("click", () => {
            modalElement.close();
        });
    }

    return {
        open(htmlContent) {
            if (modalElement && contentContainer) {
                contentContainer.innerHTML = htmlContent;
                modalElement.showModal();
            }
        },
        close() {
            if (modalElement) {
                modalElement.close();
            }
        }
    };
}
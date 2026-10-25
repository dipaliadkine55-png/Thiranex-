"use strict";

const reportModal = document.getElementById("report-modal");
const openModalButton = document.getElementById("open-modal");
const closeModalButton = document.getElementById("close-modal");
const reportForm = document.getElementById("report-form");
const reportNameInput = document.getElementById("report-name");

openModalButton.addEventListener("click", () => {
    reportModal.showModal();
});

closeModalButton.addEventListener("click", () => {
    reportModal.close();
});

reportModal.addEventListener("close", () => {
    openModalButton.focus();
});

reportModal.addEventListener("close", () => {
    reportForm.reset();
});

reportModal.addEventListener("cancel", () => {
    openModalButton.focus();
});

reportForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!reportForm.reportValidity()) {
        return;
    }

    const reportName = reportNameInput.value.trim();

    if (reportName.length < 3) {
        reportNameInput.setCustomValidity(
            "Enter a report name with at least 3 characters."
        );
        reportNameInput.reportValidity();
        return;
    }

    reportNameInput.setCustomValidity("");

    reportModal.close();
});

const filterForm = document.getElementById("filter-form");

filterForm.addEventListener("submit", (event) => {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (startDate && endDate && startDate > endDate) {
        event.preventDefault();

        document.getElementById("end-date").setCustomValidity(
            "End date must be on or after the start date."
        );

        document.getElementById("end-date").reportValidity();
    } else {
        document.getElementById("end-date").setCustomValidity("");
    }
});

filterForm.addEventListener("reset", () => {
    document.getElementById("end-date").setCustomValidity("");
});

const inviteForm = document.getElementById("invite-form");
const inviteFeedback = document.getElementById("invite-feedback");

inviteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!inviteForm.reportValidity()) {
        return;
    }

    inviteFeedback.textContent =
        "Form validated successfully. Connect a backend to send invitations.";

    inviteForm.reset();
});

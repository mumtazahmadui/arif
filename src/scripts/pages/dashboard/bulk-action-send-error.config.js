(function() {
    angular.module('rfa.dashboard')
        .constant('bulkActionSendErrors', {
            ntfToSign : 'Please select RFA for notification to signatory',
            eSign: 'Please select RFA for electronic signature',
            exhibitUpload: 'Please select RFA for exhibit value upload',
            chaser: 'No RFA(s) selected. Please select RFA(s) for sending notification chaser',
            send: 'No RFA(s) selected. Please select RFA(s) ready for submission',
            downloadAndPrint: 'No RFA(s) selected. Please select RFA(s) to download',
            uploadSignedNoRFA: 'No RFA(s) selected. Please select one RFA to upload',
            uploadSignedNextStepError: 'The selected RFA cannot be w-signed as next step is not correct. ',
            uploadSignedMultipleRFA: 'More than one RFA(s) selected. Please select one RFA to upload',
            ntfOnBoarding: "Please select Party B for notification to Onboarding",
            ntfkyc: "Please select Party B for notification to KYC",
            ntftax: "Please select Party B for notification to Tax",
            ntfcredit: "Please select Party B for notification to Credit",
            ntflegal: "Please select Party B for notification to Legal",
            ntfoperations: "Please select Party B for notification to Operations",
            ntfmanager: "Please select Party B for notification to Manager",
            ntfBslegal: "Please select Party B for notification to Legal",
            ntfBsmanager: "Please select Party B for notification to Manager",
            ssUploadReadyExecute:"This Amendment cannot be signed until all changes are accepted and all comments are resolved.",
            ntfcustom: "Please select Party B for Custom Notification.",
        });
})();
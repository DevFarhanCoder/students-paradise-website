(function ($) {
    "use strict";
    
    $(document).ready(function () {
        // ✅ Handle form submission via AJAX
        $("#contactForm").submit(function (event) {
            event.preventDefault(); // Prevent default form submission
            
            let name = $("#name").val();
            let phone = $("#phone").val();
            let course = $("#course").val();

            $.ajax({
                url: "https://backend-two-gules.vercel.app/send-email", // Backend API endpoint
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ name, phone, course }),
                dataType: "json",
                success: function (response) {
                    console.log("✅ Email sent successfully:", response);
                    alert("Email sent successfully!");
                },
                error: function (xhr, status, error) {
                    console.error("❌ Error sending email:", error);
                    alert("Error sending email: " + error);
                }
            });
        });

        // ✅ Existing navbar hover effect
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });

})(jQuery);

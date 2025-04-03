$(function () {
    $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {},
        submitSuccess: function ($form, event) {
            event.preventDefault(); // Prevent default form submission

            var name = $("#name").val();
            var email = $("#email").val();
            var subject = $("#subject").val();
            var message = $("#message").val();

            // Disable button to prevent multiple clicks
            var $this = $("#sendMessageButton");
            $this.prop("disabled", true);

            // 🔥 Updated AJAX request to send to Node.js backend
            $.ajax({
                url: "https://backend-two-gules.vercel.app/send-email", // Ensure backend allows this domain
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ 
                    name: name, 
                    email: email, 
                    subject: subject, 
                    message: message 
                }),
                success: function (response) {
                    console.log("✅ Email sent successfully:", response);
                    $("#success").html(`
                        <div class="alert alert-success">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            <strong>Your message has been sent.</strong>
                        </div>
                    `);
                    $("#contactForm").trigger("reset");
                },
                error: function (xhr, status, error) {
                    console.error("❌ Error sending email:", error);
                    $("#success").html(`
                        <div class="alert alert-danger">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            <strong>Sorry ${name}, it seems that our mail server is not responding. Please try again later!</strong>
                        </div>
                    `);
                    $("#contactForm").trigger("reset");
                },
                complete: function () {
                    setTimeout(function () {
                        $this.prop("disabled", false);
                    }, 1000);
                }
            });
        },
        filter: function () {
            return $(this).is(":visible");
        }
    });

    $("a[data-toggle='tab']").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

// Clear success message on focus
$("#name").focus(function () {
    $("#success").html("");
});

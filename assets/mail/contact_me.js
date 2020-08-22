$(function () {
    $(
        "#contactForm input,#contactForm textarea,#contactForm button"
    ).jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM       
            let name = $("input#name").val();
            let email = $("input#email").val();
            let phonenumber = $("input#phone").val();
            let body = $("textarea#message").val();
            let subject = "Contato de " + name + " (Github.IO)";            
            var firstName = $("input#name").val(); // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(" ") >= 0) {
                firstName = $("input#name").val().split(" ").slice(0, -1).join(" ");
            }
            $this = $("#sendMessageButton");
            $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages                    

            $.ajax({
                url: "https://webapilucas.azurewebsites.net/SendEmail/",              
                type: "POST",          
                data: { name, email, phonenumber, body, subject },
                contentType: "application/json",                      
                cache: false,
            }).done(function(data){
                // Success message
                $("#success").html("<div class='alert alert-success'>");
                $("#success > .alert-success")
                    .html(
                        "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
                    )
                    .append("</button>");
                $("#success > .alert-success").append(
                    "<strong>" + data + "</strong>"
                );
                $("#success > .alert-success").append("</div>");                
            }).fail(function(data){
                // Fail message
                let messageError;
                                
                if(data.responseText != null){
                    messageError = data.responseText;
                }                
                else{
                    messageError = "Desculpa " + firstName + ", parece que no momento não consigo enviar o e-mail, tente outro contato!";
                }

                $("#success").html("<div class='alert alert-danger'>");
                $("#success > .alert-danger")
                    .html(
                        "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
                    )
                    .append("</button>");
                $("#success > .alert-danger").append(
                    $("<strong>").text(messageError)
                );
                $("#success > .alert-danger").append("</div>");                
            }).always(function(){
                //clear all fields
                $("#contactForm").trigger("reset");

                setTimeout(function () {
                    $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
                }, 1000);
            });                                                
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $('a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$("#name").focus(function () {
    $("#success").html("");
});

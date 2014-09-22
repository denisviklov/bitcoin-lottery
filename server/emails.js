Accounts.emailTemplates.siteName = "bitcoinlottery.rocks";
Accounts.emailTemplates.from = "Rocks Lottery<bot@bitcoinlottery.rocks>";

Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to Awesome Town, " + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "You have been selected to participate in building a better future!"
     + " To activate your account, simply click the link below:\n\n"
     + url;
};
Accounts.emailTemplates.verifyEmail.subject = function(user) {
  return "Verify email & get Free ticket";  
};
Accounts.emailTemplates.verifyEmail.text = function (user, url){
    return "Verify your email account and get additional free lottery ticket!"
        +" To activate your account, simply click the link below:\n\n"
        + url;
};
Accounts.emailTemplates.verifyEmail.html = function (user, url){
    return "Verify your email account and get additional free lottery ticket!"
        +" To activate your account, simply click the link below:\n\n"
        + "<a href='"+url+"'>Get your free lottery ticket.</a>";
};

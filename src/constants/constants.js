module.exports = {
    POSITION_DRIVER: 'Driver',
    POSITION_CONSTRUCTOR: 'Constructor',
    COOKIE: [
        ["formula-1-session",{"authenticated":{}}],
        ["notice_behavior","implied,eu"],
        // Measures the user's bandwidth and throttles webchat functionality
        ["talkative_qos_bandwidth",5.33],
        // EU consent string, contains generated time
        ["euconsent-v2","CPVNvewPVNvewAvACDENCECgAAAAAAAAAAAAAAAAAAAA.YAAAAAAAAAAA"],
        ["notice_preferences","0:"],
        // TrustArc consent id
        ["TAconsentID","d3ad6bbe-9dbe-449a-abb9-589173f0b16f"],
        //["TAconsentID",""],
        ["notice_gdpr_prefs","0::implied,eu"],
        ["notice_poptime",1620322920000],
        ["cmapi_gtm_bl","ga-ms-ua-ta-asp-bzi-sp-awct-cts-csm-img-flc-fls-mpm-mpr-m6d-tc-tdc"],
        ["cmapi_cookie_privacy","permit 1 required"],
        ["register",{
            "event":"register",
            "eventCategory":"account registration",
            "eventAction":"Marketing Consent",
            "userID":0, // Loaded in from "account/subscriber/authenticate/by-password" body.Subscriber.Id
            "userType":0,
            "subscriptionSource":"web",
            "countryOfRegisteredUser":"USA",
            "eventLabel":"Unchecked",
            "actionType":"success"}],
        ["login",{"event":"login","componentId":"component_login_page","actionType":"success"}],
        // Login token
        ["login-session",{
            // data: { subscriptionToken: '<JWT_TOKEN>' }
        }],
        ["user-metadata",{"subscriptionSource":"","userRegistrationLevel":"full","subscribedProduct":"","subscriptionExpiry":"99/99/9999"}],
    ]
}
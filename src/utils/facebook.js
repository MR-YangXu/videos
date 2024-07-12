export const fbLoad = ({ pixel_id }) => {
    console.warn(0)
    try {
        if (location.hostname.replace(/www./g, '') === 'realshotr.com') {
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "mkmls3fyff");
        }
        console.warn(1)
        // 导入facebook监控
        if (!pixel_id) return;
        console.warn(2)
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            console.warn(3)
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
            console.warn(4)
        }(window, document, 'script','https://connect.facebook.net/en_US/fbevents.js');
    } catch(err) {}
}

export const fbInit = ({ country, client_ip_address, client_user_agent, pixel_id }) => {
    try {
        if (!fbq) return
        const facebook_pixel_user_data = {
            country,
            client_ip_address,
            client_user_agent,
        }
        fbq('init', pixel_id, facebook_pixel_user_data);
    } catch(err) {}
}

/**
 * 
 * @param {eventName} param0 
 * @returns 
 * PageView  页面上报
 * InitiateCheckoutIate  点击弹出订阅弹窗上报 结账
 * Purchase  支付成功上报 并且要上报金额
 */
export const fbTrack = ({ eventName, customAttributes = {}, eventId = {} }) => {
    try {
        if (!fbq) return
        const event_id_InitiateCheckout = Object.assign({
            eventID: Math.random().toString(36).substr(2) + eventName + new Date().getTime()
        }, eventId);
        fbq('track', eventName, customAttributes, event_id_InitiateCheckout)
    } catch(err) {}
}
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export const loadFacebookSDK = () => {
  return new Promise<void>((resolve) => {
    if (window.FB) {
      resolve();
      return;
    }

    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '25072021329136917', 
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    }(document, 'script', 'facebook-jssdk'));
  });
};

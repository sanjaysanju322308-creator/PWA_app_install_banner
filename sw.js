const STATIC_CACHE = "static-v4";
const DYNAMIC_CACHE = "dynamic-v4";

self.addEventListener("install", function (event) {
    console.log("Installed", event);
    event.waitUntil(
        caches.open("static-v1").then((cache) => {
            cache.addAll([
                "/",
                "index.html",
                "/manifest.json",
                "/js/script.js",
                "/js/jquery-3.5.1.min.js",

                "/css/style.css",

                "/images/logo.svg",
                "/images/search.svg",

                "/fonts/product_sans_bold-webfont.woff2",
                "/fonts/product_sans_bold-webfont.woff",
                "/fonts/product_sans_regular-webfont.woff2",
                "/fonts/product_sans_regular-webfont.woff",

                "https://traveller.talrop.works/api/v1/places/categories/",
                "https://traveller.talrop.works/api/v1/places/"
            ])
        })
    );
});

self.addEventListener("activate", function (event) {
    console.log("Activated", event);
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) =>{
                    if (key !== "STATIC_CACHE" && key !== "DYNAMIC_CACHE") {
                        console.log(key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", function (event) {
    // console.log("Service Worker fetch", event);
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            } else {
                return fetch(event.request).then((res) => {
                    return caches.open("DYNAMIC_CACHE").then((cache) => {
                        cache.put(event.request.url,res.clone());
                        return res;
                    })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                })
            }
        })
    )
})
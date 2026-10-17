// Old address depraxis.zaylogear.com -> permanent redirect to the clinic's own domain, keeping the path and query.
export default {
  fetch(request) {
    const url = new URL(request.url);
    return Response.redirect("https://dpraxisclinics.com" + url.pathname + url.search, 301);
  },
};

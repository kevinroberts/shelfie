const Authentication = require('./controllers/authentication-controller')
const ClipController = require('./controllers/clip-controller')
const TagController = require('./controllers/tag-controller')
const FavoritesController = require('./controllers/favorites-controller')
const UploadController = require('./controllers/uploads-controller')
const SiteSettingsController = require('./controllers/site-controller')
const passport = require('./services/passport')
const express = require('express')
const env = require('get-env')()
const bruteforce = require('./services/bruteforce_check')
const FindClip = require('./queries/find-clip')
const log = require('./helpers/logging')
const xss = require('xss')
const queryString = require('querystring');

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

module.exports = function (app) {
  app.get('/message', requireAuth, function (req, res) {
    res.send({ message: 'You have successfully authenticated' })
  })
  app.get('/profile', requireAuth, Authentication.getProfile)
  app.post('/signin', bruteforce.loginBruteforce.prevent, requireSignin, Authentication.signin)
  app.post('/signup', Authentication.signup)
  app.post('/profile', requireAuth, Authentication.editProfile)
  app.post('/reset-request', bruteforce.resetPassBruteforce.prevent, Authentication.resetRequest)
  app.post('/reset/:token', Authentication.resetPassword)

  // handle clip related requests
  app.get('/clips', ClipController.getClips)
  app.get('/my-clips', requireAuth, ClipController.getMyClips)
  app.get('/favorite-clips', requireAuth, ClipController.getMyFavoriteClips)

  app.get('/clip', ClipController.findClip)
  app.post('/clip', requireAuth, ClipController.createClip)
  app.post('/edit-clip', requireAuth, ClipController.editClip)
  app.post('/remove-clip', requireAuth, ClipController.removeClip)

  // handle tag related requests
  app.post('/tags', requireAuth, TagController.createTag)
  app.post('/edit-tags', requireAuth, TagController.editTag)
  app.post('/remove-tags', requireAuth, TagController.removeTag)
  app.get('/tags', TagController.getTags)
  app.get('/my-tags', requireAuth, TagController.getMyTags)
  app.get('/favorite-tags', requireAuth, TagController.getFavoriteTags)

  // handle favorite related requests
  app.post('/favorite', requireAuth, FavoritesController.createRemoveFavorite)

  // handle user uploads
  app.post('/uploads', requireAuth, UploadController.onUpload)
  app.delete('/uploads/:uuid', UploadController.onDeleteFile)

  // handle site settings
  app.get('/settings', requireAuth, SiteSettingsController.getSiteSettings)
  app.post('/settings', requireAuth, SiteSettingsController.editSiteSettings)

  // Express only serves static assets in production
  if (env === 'prod') {
    // app.use((req, res, cb) => {
    //   res.status(404).sendFile(Path.join(PUBLIC_DIR, "errors/404.html"))
    // })
    //
    // app.use((err, req, res, cb) => {
    //   res.status(err.status || 500).sendFile(Path.join(PUBLIC_DIR, "errors/500.html"))
    // })

    app.use(express.static(process.env.STATIC_SERVE_DIR))

    app.get('*', (req, res) => {
      console.log('request url: ', req.url)
      var match = RegExp('^/clip/([0-9a-fA-F]{24}).*$', 'g').exec(req.url)
      if (match) {
        console.log('this is a clip page', match)
        FindClip(match[1]).then((result = []) => {
          if (result) {
            console.log('rendering clip meta', renderFullPage(getClipMeta(result), req))
            res.send(renderFullPage(getClipMeta(result), req))
          } else {
            res.send(renderFullPage(getBaseMeta()))
          }
        }).catch(function (err) {
          log.error('find clip query error:', err)
          res.send(renderFullPage(getBaseMeta(), req))
        })
      } else {
        res.send(renderFullPage(getBaseMeta(), req))
      }
      // res.sendFile(path.resolve(`${process.env.STATIC_SERVE_DIR}/index.html`))
    })
  }
}

function renderFullPage (meta, req) {
  return `
    <!doctype html>
    <html>
      <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# music: http://ogp.me/ns/music#">
        ${meta}
        <meta property="og:url" content="https://vinberts.com${xss(req.url, {})}" />
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <link rel="stylesheet" href="/static/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/static/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="apple-touch-icon" sizes="57x57" href="/static/img/favicon/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/static/img/favicon/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/static/img/favicon/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/static/img/favicon/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/static/img/favicon/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/static/img/favicon/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/static/img/favicon/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/static/img/favicon/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/static/img/favicon/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/static/img/favicon/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/static/img/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/static/img/favicon/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/static/img/favicon/favicon-16x16.png">
        <!-- Piwik -->
<script type="text/javascript">
    var _paq = _paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
    var u="//vinberts.piwikpro.com//";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', 1]);
    var d=document, g=d.createElement('script'), 
    s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; 
    g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();
    </script>
<noscript><p>
  <img src="//vinberts.piwikpro.com/piwik.php?idsite=1" 
  style="border:0;" alt="" /></p>
  </noscript>
<!-- End Piwik Code -->
      </head>
      <body>
      <div id="root"></div>
      <!--Bootstrap 4 libraries-->
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js" integrity="sha384-3ceskX3iaEnIogmQchP8opvBy3Mi7Ce34nWjpBIwVTHfGYWQS9jwHDVRnpKKHJg7" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.3.7/js/tether.min.js" integrity="sha384-XTs3FgkjiBgo8qjEjBk0tGmf3wPrWtA6coPfQDfFEY8AnYJwjalXCiosYRBIBZX8" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/js/bootstrap.min.js" integrity="sha384-BLiI7JTZm+JWlgKa0M0kGRpJbF2J8q+qreVrKBC47e3K6BW78kGLrCkeRX6I9RoK" crossorigin="anonymous"></script>
      <!--main javascript bundle-->
      <script src="/bundle.js"></script>
      </body>
    </html>
    `
}

function getClipMeta (clip) {
  let description = clip.description || `a clip titled ${clip.title} by ${clip._creator.username}`
  let duration = clip.length < 1000 ? 1 : Math.round(clip.length / 1000)
  let sourceUrl = `https://vinberts.com${queryString.stringify(clip.sourceUrl)}`
  return `
    <title>${clip.title}</title>
    <meta property="og:title" content="${clip.title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="music.song" />
    <meta property="music:duration" content="${duration}" />
    <meta property="og:site_name" content="Shelfie" />
    <meta property="og:image" content="https://vinberts.com/static/img/wave.jpg" />
    <meta property="og:image:secure_url" content="https://vinberts.com/static/img/wave.jpg" />
    <meta property="og:audio" content="${sourceUrl}" />
    <meta property="og:audio:secure_url" content="${sourceUrl}" />
    <meta property="og:audio:type" content="audio/vnd.facebook.bridge" />
    `
}

function getBaseMeta () {
  return `
    <title>Shelfie - Library</title>
    <meta property="og:description" content="Shelfie is a web based application to manage and organize WAV sound files (clips) for a group of users. WAV files can be created and updated from any user account." />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Shelfie - Audio Clip Library" />
    <meta property="og:image" content="https://vinberts.com/static/img/wave.jpg" />
    <meta property="og:image:secure_url" content="https://vinberts.com/static/img/wave.jpg" />
    `
}

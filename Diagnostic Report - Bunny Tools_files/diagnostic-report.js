function setSpeed(e) {
  $("#currentSpeed").text(e.toFixed(2)), 300 < e && (e = 300);
  e = (265 / 300) * e - 45;
  TweenMax.to("#bigLine", 0.3, {
    rotation: e,
    repeat: 0,
    transformOrigin: "95% 70%",
    ease: Linear.easeNone,
  });
}

function randomNumber(e, n) {
  return Math.random() * (n - e) + e;
}

function qs(e) {
  e = e.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
  e = location.search.match(new RegExp("[?&]" + e + "=([^&]+)(&|$)"));
  return e && decodeURIComponent(e[1].replace(/\+/g, " "));
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function qs(key) {
  key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
  var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

// document.onload = () => setTimeout(startDiagnosticTest, 3000);

setTimeout(startDiagnosticTest, 2000);
function startDiagnosticTest() {
  $(".testingArea").fadeIn();
  $("#page-title").text("Running diagnostic test");

  $("#start-button").prop("disabled", true);
  $("html, body")
    .stop()
    .animate(
      {
        scrollTop: $("#testingArea").offset().top,
      },
      500,
      "swing"
    );

  function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf("MSIE ");
    if (msie > 0) {
      return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
    }
    var trident = ua.indexOf("Trident/");
    if (trident > 0) {
      var rv = ua.indexOf("rv:");
      return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
    }
    var edge = ua.indexOf("Edge/");
    if (edge > 0) {
      return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
    }
    return false;
  }

  var OSName = "Unknown";
  if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1)
    OSName = "Windows 10";
  if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1)
    OSName = "Windows 8";
  if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1)
    OSName = "Windows 7";
  if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1)
    OSName = "Windows Vista";
  if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1)
    OSName = "Windows XP";
  if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1)
    OSName = "Windows 2000";
  if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
  if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
  if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";

  var browserName = "Unknown";
  // Opera 8.0+
  if (
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0
  )
    browserName = "Opera";
  // Firefox 1.0+
  if (typeof InstallTrigger !== "undefined") browserName = "Firefox";
  // Safari 3.0+ "[object HTMLElementConstructor]"
  if (
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    )
  )
    browserName = "Safari";

  // Internet Explorer 6-11
  var isIE = detectIE();
  if (isIE) browserName = "Internet Explorer";

  // Edge 20+
  if (!isIE && !!window.StyleMedia) browserName = "Microsoft Edge";

  // Chrome 1+
  if (!!window.chrome && !!window.chrome.webstore) browserName = "Chrome";

  var serverHeaderPremium;
  var serverDataPremium;
  var serverZonePremium;
  var serverIdPremium;
  var serverHeaderVolume;
  var serverDataVolume;
  var serverZoneVolume;
  var serverIdVolume;
  var finalSpeedPremium = 0.0;
  var finalSpeedVolume = 0.0;
  var fileSize = 1000;
  var abortVolume = false;
  var volumeDataDownloaded = [];
  var totalVolumeDownloaded = 0.0;
  var averageVolumeSpeed = 0.0;
  var abortPremium = false;
  var premiumDataDownloaded = [];
  var totalPremiumDownloaded = 0.0;
  var averagePremiumSpeed = 0.0;
  var stageTwoStarted = { yes: false };

  var guidValue = guid();

  $.get(
    "https://diagnostictest-" + guidValue + ".bunnyinfra.net",
    function (e) {}
  );

  const add = (a, b) => a + b;
  var startTime = new Date();
  var startTimeVolume = new Date();
  var absoluteStartDate = new Date();
  var absoluteStartDateVolume = new Date();
  var totalDataDownloadedGlobal = 0.0;
  var lockPremium = false;
  var lockVolume = false;

  function stageOne() {
    var firstRun = true;
    $.ajax({
      cache: false,
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener(
          "progress",
          function (evt) {
            if (evt.lengthComputable) {
              if (abortPremium && !lockPremium) {
                lockPremium = true;
                totalPremiumDownloaded += fileSize * (evt.loaded / evt.total);
                averagePremiumSpeed =
                  (totalPremiumDownloaded /
                    (Math.abs(absoluteStartDate - new Date()) / 1000)) *
                  8;
                $(".premiumSpeed").text(averagePremiumSpeed.toFixed(2));
                totalDataDownloadedGlobal += totalPremiumDownloaded;
                $(".dataUsed").text(totalDataDownloadedGlobal.toFixed(2));
                console.log(
                  "[Premium] It took " +
                    Math.abs(absoluteStartDate - new Date()) / 1000 +
                    " seconds to download " +
                    totalPremiumDownloaded +
                    " MB."
                );
                finalSpeedPremium = averagePremiumSpeed.toFixed(2);
                setSpeed(0);
                $(".prem").hide();
                $(".popLoc").text(
                  "Testing Volume (" +
                    serverZoneVolume +
                    "-" +
                    serverIdVolume +
                    ")"
                );
                xhr.abort();
                setTimeout(function () {
                  $(".volu").show();
                  absoluteStartDateVolume = new Date();
                  startTimeVolume = new Date();
                  stageTwo();
                }, 3000);
              } else if (firstRun) {
                setTimeout(function () {
                  abortPremium = true;
                }, 8000);
              } else if (!firstRun) {
                var curr =
                  ((evt.loaded / evt.total) * fileSize) /
                  (Math.abs(startTime - new Date()) / 1000);
                premiumDataDownloaded.push(curr);
                setSpeed(curr * 8);
              }
              firstRun = false;
            }
          },
          false
        );
        return xhr;
      },
      url: "https://test.b-cdn.net/" + fileSize + "mb.bin?v=diagnostics",
    })
      .done(function () {
        if (!abortPremium) {
          totalPremiumDownloaded += fileSize;
          console.log("Connection very fast, running again...");
          startTime = new Date();
          stageOne();
        }
      })
      .fail(function () {
        $(".volu").show();
        absoluteStartDateVolume = new Date();
        startTimeVolume = new Date();
        console.warn("It failed, so we will start again");
        if (!stageTwoStarted.yes) stageTwo();
      });
  }

  function stageTwo() {
    var firstRunVolume = true;
    if (stageTwoStarted.yes) {
      return;
    }
    stageTwoStarted.yes = true;
    $.ajax({
      cache: false,
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener(
          "progress",
          function (e) {
            if (e.lengthComputable) {
              if (abortVolume && !lockVolume) {
                lockVolume = true;
                totalVolumeDownloaded += fileSize * (e.loaded / e.total);
                averageVolumeSpeed =
                  (totalVolumeDownloaded /
                    (Math.abs(absoluteStartDateVolume - new Date()) / 1000)) *
                  8;
                totalDataDownloadedGlobal += totalVolumeDownloaded;
                $(".dataUsed").text(totalDataDownloadedGlobal.toFixed(2));
                console.log(
                  "[Volume] It took " +
                    Math.abs(absoluteStartDateVolume - new Date()) / 1000 +
                    " seconds to download " +
                    totalVolumeDownloaded +
                    " MB."
                );
                $(".volumeSpeed").text(averageVolumeSpeed.toFixed(2));
                $(".volumeDataUsed").text(totalVolumeDownloaded);
                $(".volu").hide();
                console.log(
                  "[Status] A total of " +
                    totalDataDownloadedGlobal.toFixed(2) +
                    " MB was used for speedtesting (premium: " +
                    totalPremiumDownloaded.toFixed(2) +
                    " + volume: " +
                    totalVolumeDownloaded.toFixed(2) +
                    ")."
                );
                finalSpeedVolume = averageVolumeSpeed.toFixed(2);
                setSpeed(0);
                xhr.abort();
                alert("aborting now!");
                setTimeout(function () {
                  stageThree();
                }, 3000);
              } else if (firstRunVolume) {
                setTimeout(function () {
                  abortVolume = true;
                }, 8000);
              } else if (!firstRunVolume) {
                var curr =
                  ((e.loaded / e.total) * fileSize) /
                  (Math.abs(startTimeVolume - new Date()) / 1000);
                volumeDataDownloaded.push(curr);
                setSpeed(curr * 8);
              }
              firstRunVolume = false;
            }
          },
          false
        );
        return xhr;
      },
      url: "https://testvideo.b-cdn.net/" + fileSize + "mb.bin?v=diagnostics",
    })
      .done(function () {
        totalVolumeDownloaded += fileSize;
        startTimeVolume = new Date();
        console.log("Connection very fast, running again...");
        stageTwo();
      })
      .fail(function () {
        stageThree();
      });
  }

  function stageThree() {
    setTimeout(function () {
      $(".speedtestArea").slideUp();
      $(".loadingArea").fadeIn();
      $(".currentStep").text("Step 2/3: Collecting DNS Information");
      $(".currentDesc").text(
        "Please wait while we retrieve your DNS resolver."
      );
      setTimeout(function () {
        $(".currentStep").text("Step 3/3: Collecting System Information");
        $(".currentDesc").text(
          "Please wait while we retreive your OS/browser type and OS."
        );
        setTimeout(function () {
          $(".currentStep").text("Diagnostic Test Complete.");
          $(".currentDesc").text("We are redirecting you to the result");
          $(".loadingArea").slideUp();
          $.get(
            "https://cors-proxy.corrsy.workers.dev/tools.bunny.net/api/diagnostic-test?edgeServerId=" +
              encodeURIComponent(serverIdPremium) +
              "&edgeServerZone=" +
              encodeURIComponent(serverZonePremium) +
              "&edgeServerIdVolume=" +
              encodeURIComponent(serverIdVolume) +
              "&edgeServerZoneVolume=" +
              encodeURIComponent(serverZoneVolume) +
              "&browserName=" +
              encodeURIComponent(browserName) +
              "&guidResponse=" +
              encodeURIComponent(guidValue) +
              "&performanceTime=" +
              finalSpeedPremium * 1000 +
              "&performanceTimeVolume=" +
              finalSpeedVolume * 1000 +
              "&operatingSystem=" +
              encodeURIComponent(OSName),
            function (data) {
              $(".reportBtn").attr(
                "href",
                "/diagnostic-report-result/?data=" + encodeURIComponent(data)
              );
              window.location.href =
                "/diagnostic-report-result/?data=" + encodeURIComponent(data);
            }
          );
        }, 3000);
      }, 3000);
    }, 2000);
  }

  var startTesting = function () {
    $.ajax({
      url: "https://testvideo.b-cdn.net/300kb.jpg?v=" + startTime,
    })
      .done(function (d, t, x) {
        serverHeaderVolume = x.getResponseHeader("Server");
        serverDataVolume = serverHeaderVolume.split("-");
        serverZoneVolume = serverDataVolume[1];
        serverIdVolume = serverDataVolume[2];
        // Set POP name
        serverZonePremium = serverZonePremium.replace(/[0-9]/g, "");
        serverZoneVolume = serverZoneVolume.replace(/[0-9]/g, "");
        $(".popLoc").text(
          "Testing Premium (" + serverZonePremium + "-" + serverIdPremium + ")"
        );
        $(".prem").show();
        absoluteStartDate = new Date();
        console.log("Starting Premium Test...");
        stageOne();
      })
      .fail(function () {
        serverHeaderVolume = "N/A";
        serverDataVolume = "0";
        serverZoneVolume = "0";
        serverIdVolume = "0";
        // Set POP name
        serverZonePremium = serverZonePremium.replace(/[0-9]/g, "");
        serverZoneVolume = serverZoneVolume.replace(/[0-9]/g, "");
        $(".popLoc").text(
          "Testing Premium (" + serverZonePremium + "-" + serverIdPremium + ")"
        );
        $(".prem").show();
        absoluteStartDate = new Date();
        console.log("Starting Premium Test...");
        stageOne();
      });
  };

  $.ajax({
    url: "https://test.b-cdn.net/300kb.jpg?v=" + startTime,
  })
    .done(function (d, t, x) {
      setSpeed(0);
      serverHeaderPremium = x.getResponseHeader("Server");
      serverDataPremium = serverHeaderPremium.split("-");
      serverZonePremium = serverDataPremium[1];
      serverIdPremium = serverDataPremium[2];
      startTesting();
    })
    .fail(function () {
      startTesting();
    });
}

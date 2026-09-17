const status = document.getElementById("status");
const output = document.getElementById("output");
const enableButton = document.getElementById("enable");
const testButton = document.getElementById("test");

let registration;

function log(text) {
  output.textContent += text + "\n";
}

async function setup() {
  if (!("serviceWorker" in navigator)) {
    status.textContent = "Service workers aren't supported.";
    return;
  }

  if (!("Notification" in window)) {
    status.textContent = "Notifications aren't supported.";
    return;
  }

  registration = await navigator.serviceWorker.register("./sw.js");

  await navigator.serviceWorker.ready;

  status.textContent = "Ready.";

  log("Service worker registered.");
  log("Notification permission: " + Notification.permission);
}

enableButton.addEventListener("click", async () => {
  try {
    const permission = await Notification.requestPermission();

    log("Permission result: " + permission);

    if (permission !== "granted") {
      status.textContent = "Notifications weren't allowed.";
      return;
    }

    status.textContent = "Notifications enabled!";

    log("Notifications are enabled.");
    log("");
    log("The next step is creating a PushSubscription.");
  } catch (error) {
    log("ERROR: " + error);
  }
});

testButton.addEventListener("click", async () => {
  if (!registration) {
    log("Service worker isn't ready.");
    return;
  }

  if (Notification.permission !== "granted") {
    log("Enable notifications first.");
    return;
  }

  await registration.showNotification("Push Test", {
    body: "Your iOS web app can display notifications!",
    tag: "local-test"
  });

  log("Local notification requested.");
});

setup();
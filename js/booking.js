document.addEventListener("DOMContentLoaded", function () {
  var CAFE_PHONE = "919163692705"; // WhatsApp/international format, no + or spaces

  // Fill in the cafe's real UPI ID here once you have one, e.g. "hillscafe@okicici"
  var UPI_ID = "";
  var UPI_NAME = "Hills Cafe";

  /* ---------- Reservation form -> WhatsApp ---------- */
  var form = document.getElementById("booking-form");
  var errorEl = document.getElementById("form-error");
  var confirmPanel = document.getElementById("confirm-panel");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorEl.textContent = "";

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var date = form.date.value;
      var time = form.time.value;
      var guests = form.guests.value;
      var seating = form.seating.value;
      var notes = form.notes.value.trim();

      if (!name || !phone || !date || !time) {
        errorEl.textContent = "Please fill in your name, phone, date and time.";
        return;
      }
      if (!/^[0-9+\s-]{7,15}$/.test(phone)) {
        errorEl.textContent = "That phone number doesn't look right — please double check it.";
        return;
      }

      var lines = [
        "Hi Hills Cafe, I'd like to book a table.",
        "Name: " + name,
        "Phone: " + phone,
        "Date: " + date,
        "Time: " + time,
        "Guests: " + guests,
        "Seating: " + seating
      ];
      if (notes) lines.push("Notes: " + notes);

      var message = encodeURIComponent(lines.join("\n"));
      var waUrl = "https://wa.me/" + CAFE_PHONE + "?text=" + message;

      window.open(waUrl, "_blank", "noopener");
      confirmPanel.classList.add("show");
      confirmPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---------- Advance payment ---------- */
  var amountButtons = document.querySelectorAll("#amount-options button");
  var payBtn = document.getElementById("upi-pay-btn");
  var statusEl = document.getElementById("payment-status");
  var currentAmount = 200;

  function updatePayButton() {
    payBtn.textContent = "Pay ₹" + currentAmount + " via UPI";
  }

  amountButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      amountButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentAmount = parseInt(btn.dataset.amount, 10);
      updatePayButton();
    });
  });

  payBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!UPI_ID) {
      statusEl.classList.add("show");
      statusEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    var upiUrl = "upi://pay?pa=" + encodeURIComponent(UPI_ID) +
      "&pn=" + encodeURIComponent(UPI_NAME) +
      "&am=" + currentAmount +
      "&cu=INR&tn=" + encodeURIComponent("Hills Cafe table advance");

    window.location.href = upiUrl;
  });

  updatePayButton();
});

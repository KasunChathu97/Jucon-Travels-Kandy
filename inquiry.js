(function () {
  function pickValue(form, selector) {
    var el = form.querySelector(selector);
    if (!el) return '';
    return (el.value || '').trim();
  }

  function pickCheckedValues(form, name) {
    var nodes = form.querySelectorAll('input[name="' + name + '"]:checked');
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      out.push(nodes[i].value);
    }
    return out;
  }

  function endpointForForm(form) {
    return form.getAttribute('data-endpoint') || 'send-inquiry.php';
  }

  function toPayload(form) {
    var inquiryType = form.getAttribute('data-inquiry-type') || '';

    var payload = {
      inquiry_type: inquiryType,
      name: pickValue(form, '[name="name"]'),
      email: pickValue(form, '[name="email"]'),
      country: pickValue(form, '[name="country"]'),
      whatsapp: pickValue(form, '[name="whatsapp"]'),
      tour: pickValue(form, '[name="tour"]'),
      package: pickValue(form, '[name="package"]'),
      arrival_date: pickValue(form, '[name="arrival_date"]'),
      departure_date: pickValue(form, '[name="departure_date"]'),
      adults: pickValue(form, '[name="adults"]'),
      children: pickValue(form, '[name="children"]'),
      rooms: pickValue(form, '[name="rooms"]'),
      budget: pickValue(form, '[name="budget"]'),
      message: pickValue(form, '[name="message"]')
    };

    payload.hotel_category = pickCheckedValues(form, 'hotel_category[]');
    payload.meal_plan = pickCheckedValues(form, 'meal_plan[]');
    payload.interest = pickCheckedValues(form, 'interest[]');

    return payload;
  }

  function attach(form) {
    if (form.dataset.inquiryBound === '1') return;
    form.dataset.inquiryBound = '1';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var payload = toPayload(form);

      if (!payload.name) {
        alert('Please enter your name.');
        return;
      }
      if (!payload.email) {
        alert('Please enter your email.');
        return;
      }

      fetch(endpointForForm(form), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () {
            return { ok: false, error: 'Invalid server response' };
          });
        })
        .then(function (data) {
          if (data && data.ok) {
            alert('Inquiry sent successfully.');
            try {
              form.reset();
            } catch (_) {}

            // If this is inside a modal, close it if the page provides closeInquiry().
            if (typeof window.closeInquiry === 'function') {
              window.closeInquiry();
            }
          } else {
            alert((data && data.error) ? data.error : 'Failed to send inquiry.');
          }
        })
        .catch(function () {
          alert('Failed to send inquiry. Please try again.');
        });
    });
  }

  function boot() {
    var quickForms = document.querySelectorAll('form.inquiry-form');
    for (var i = 0; i < quickForms.length; i++) attach(quickForms[i]);

    var tourForm = document.getElementById('tourInquiryForm');
    if (tourForm) attach(tourForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

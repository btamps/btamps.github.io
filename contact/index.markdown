---
title: Contact
permalink: /contact/
body-class: contact
menu: main
---

<div class="container contact-wrapper">
  <div class="row justify-content-center">
    <div class="col-sm-8">
      <img src="../img/ui/send-email.svg"/>
      <h1>Contact Me</h1>
      <h3>Fill out the form to get in touch.</h3>
      <form action="https://formspree.io/billytamplin@gmail.com"
            method="POST">
        <div class="name-title">Name <span class="required">*</span></div>
        <div class="form-group">
          <div class="row names">
            <div class="col-md-6 first-name">
              <label for="senderFirst" class="sender-first-name">First Name</label>
              <input type="text" class="form-control" name="First Name" id="senderFirst" required>
            </div>
            <div class="col-md-6 last-name">
              <label for="senderLast" class="sender-last-name">Last Name</label>
              <input type="text" class="form-control" name="Last Name" id="senderLast" required>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="senderEmail">Email Address <span class="required">*</span></label>
          <input type="email" class="form-control" name="Email" id="senderEmail" required>
        </div>

        <div class="form-group">
          <label class="wrapper" for="states">What can I help you with? <span class="required">*</span></label>
          <div class="dropdown">
            <select id="typeselector" name="_subject">
               <option value="hello">Just saying hello...</option>
               <option value="illustrations">Branding Illustration</option>
               <option value="icons">Icon Set</option>
            </select>
          </div>
        </div>

        <div id="output">
          <!-- Hello Block -->
          <div class="form-group">
            <label for="emailMessage">Message <span class="required">*</span></label>
            <textarea class="form-control" rows="5" id="emailMessage" name="Message" required></textarea>
          </div>
        </div>

        <button type="submit" class="btn btn-default">Send Message</button>
        <input type="hidden" name="_next" value="/thank-you/" />
      </form>
    </div>

  </div>
</div>

---
title: Contact
permalink: /contact/
body-class: contact
---

<div class="container contact-wrapper">
  <div class="row">
    <h1>Contact Me</h1>
    <h3>Fill out the form to get in touch.</h3>
    <form action="https://formspree.io/billytamplin@gmail.com"
          method="POST">
      <div class="name-title">Name</div>
      <div class="form-group form-group-lg">
        <div class="row names">
          <div class="col-md-6 first-name">
            <label for="senderFirst" class="sender-first-name">First Name</label>
            <input type="text" class="form-control" name="first-name" id="senderFirst">
          </div>
          <div class="col-md-6 last-name">
            <label for="senderLast" class="sender-last-name">Last Name</label>
            <input type="text" class="form-control" name="last-name" id="senderLast">
          </div>
        </div>
      </div>
      <div class="form-group form-group-lg">
        <label for="exampleInputEmail1">Email Address</label>
        <input type="email" class="form-control" name="_replyto" id="exampleInputEmail1">
      </div>
      <div class="form-group form-group-lg">
        <label for="emailMessage">Message</label>
        <textarea class="form-control" rows="6" id="emailMessage" name="message"></textarea>
      </div>
      <button type="submit" class="btn btn-default">Send Message</button>
    </form>
  </div>
</div>

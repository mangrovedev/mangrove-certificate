# mangrove-certificate

This is an app developed for 
Mangrove and Marine Biodiversity Conservation Foundation of Maharashtra (Mangrove Foundation)
(An Autonomous Body under Revenue & Forests Department, Government of Maharashtra)
Office of the Additional Principal Chief Conservator of Forests, Mangrove Cell,
Wakefield House, 302, SS Ram Gulam Marg, 
Ballard Estate, Fort, Mumbai, Maharashtra - 400001
https://mangroves.maharashtra.gov.in
Phone: 022-22694984

The app provides an interface for adopting a mangrove. The app uses Google App Script to serve all the APIs. The following APIs are supported by the App Script:

API URL: https://script.google.com/macros/s/AKfycbwbO_4ITz_ganjLr00prZx21zqObsqMxVK6qz1vY6M31-rDsAqvrw32MpkvWT3o_Y3TLg/exec

## 1. Submit Form API
Method: POST
Parameters:"Full Name","Email Address", "Phone Number", "Country", "State", "City"
Mandatory Parameters:"Full Name", "Email Address"
JSON Response expected:{"result","success"} or {"result":"error","error":"Error Description"}

## 2. Generate Certificate
Method: GET
Parameters: email,oper
email = Email Address as registered in Submit Form API
oper = "generate"
JSON Response expected: 
{"data":{"filename":"File Name Generated,"email":"Email Address"},"error":false}
or
{"data":"","error":"Error Description"}

## 3. Find Certificate
Method: GET
Parameters: email, oper
email = Email Address as registered in Submit Form API
oper = "find"
JSON Response expected: 
{"data":{"pdfURL":"URL of PDF file","email":email},"error":false}
or
{"data":"","error":"Error Description"}


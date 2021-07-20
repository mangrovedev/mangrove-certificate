# Mangrove Dedication Certificate App

This is an app developed by [Accion Labs](https://www.accionlabs.com) for 
[Mangrove and Marine Biodiversity Conservation Foundation of Maharashtra](https://mangroves.maharashtra.gov.in) (Mangrove Foundation)
(An Autonomous Body under Revenue & Forests Department, Government of Maharashtra)

The app provides an interface for adopting a mangrove. The app can be used directly using the app's URL or can be embedded in a website using the embeddable widget as described below.

## Direct App Usage
To use the app directly, use this URL: https://mangrovedev.github.io/mangrove-certificate/

## Embeddable Widget
The app can be embedded in any website by using the following embed code:

```HTML
  <script type="text/javascript" src="https://mangrovedev.github.io/mangrove-certificate/widget.js"></script>
  <a class="certificate-registration-widget" href="https://mangrovedev.github.io/mangrove-certificate/">Become a Mangrove Guardian</a>
```
## Files
The repository contains the following files:
| File Name  | Description                                                                |
|------------|----------------------------------------------------------------------------|
| index.html | Main HTML file that is used to generate the app UI                         |
| widget.js  | Javascript include file to embed the widget                                |
| code.gs    | Google App Script code that needs to be inserted in the Google Spreadsheet |

## API Specifications
The following APIs are supported by the App Script:

API URL: https://script.google.com/macros/s/AKfycbwbO_4ITz_ganjLr00prZx21zqObsqMxVK6qz1vY6M31-rDsAqvrw32MpkvWT3o_Y3TLg/exec

### 1. Submit Form API
```
Method: POST
Parameters:"Full Name","Email Address", "Phone Number", "Country", "State", "City"
Mandatory Parameters:"Full Name", "Email Address"
JSON Response expected:{"result","success"} or {"result":"error","error":"Error Description"}
```
### 2. Generate Certificate
```
Method: GET
Parameters: email,oper
email = Email Address as registered in Submit Form API
oper = "generate"
JSON Response expected: 
{"data":{"filename":"File Name Generated,"email":"Email Address"},"error":false}
or
{"data":"","error":"Error Description"}
```
### 3. Find Certificate
```
Method: GET
Parameters: email, oper
email = Email Address as registered in Submit Form API
oper = "find"
JSON Response expected: 
{"data":{"pdfURL":"URL of PDF file","email":email},"error":false}
or
{"data":"","error":"Error Description"}
```

---
layout: post
title: "REST API with cURL"
tags: [API & Services, Shell, Python]
icon: curl.svg
iconWhite: true
notfull: 1
toc: true
keywords: "rest api curl http request put set get post patch python request"
date: 2022-05-15
---

- [Official doc](https://curl.se/).
- In **[Postman](https://www.postman.com/)**, we can click on "Code snippet" icon (on the right side) to show the curl command (and other commands too).

## General

Note that, `-X = --request`.

```bash
curl -X [method] [options] [URL]
```

## `request` in Python

👉 [Official documentation](https://docs.python-requests.org/en/latest/user/quickstart/#make-a-request).

```python
import requests
```

```python
# GET
headers = {'user-agent': 'my-app/0.0.1'}
r = requests.get('https://api.github.com/events', headers=headers)
```

```python
# POST
r = requests.post('https://httpbin.org/post', data={'key': 'value'})
```

```python
# For JSON-encoded
import json
payload = {'some': 'data'}
r = requests.post(url, data=json.dumps(payload))
```

Parameters in URL,

```python
payload = {'key1': 'value1', 'key2': ['value2', 'value3']}
r = requests.get('https://httpbin.org/get', params=payload)
print(r.url) # https://httpbin.org/get?key1=value1&key2=value2&key2=value3
```

### Response

```python
r.text
# '[{"repository":{"open_issues":0,"url":"https://github.com/...
```

```python
# Binary Response Content
r.content
# b'[{"repository":{"open_issues":0,"url":"https://github.com/...
```

```python
# JSON Response Content
r.json()
# [{'repository': {'open_issues': 0, 'url': 'https://github.com/...
```

Status code?

```python
r.status_code # 200

r.status_code == requests.codes.ok # True
```

Headers?

```python
r.headers
```

If response contains cookies?

```python
r.cookies
```

## Some examples

### GET

```bash
curl -X GET 'http://abc:3000/xyz/enpoint?paramOne=1&paramTwo=2' \
	--header 'clientEmail: abc@xyz.com' \
	--header 'privateKey: LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2Z0lCQU'
	}'
```

### POST

::: warning
The JSON data must be in form of `'{with the "double quotes" inside}'`. This `"{single 'quote' inside}"` will not work!

In case you wanna get a good form of data (with the quotes) from a variable (**Python**),

```python
import json
data = "{'x': 1, 'y': 2}"
data = json.dumps(data)
# data will be:
# '{"x": 1, "y": 2}'
```
:::

```bash
curl -X POST 'http://abc:3000/xyz/enpoint?paramOne=1&paramTwo=2' \
	--header 'clientEmail: abc@xyz.com' \
	--header 'privateKey: LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2Z0lCQU' \
	--header 'Content-Type: application/json' \
	--data-raw '{
		"dataMain": {
			"keyOne": "valueOne",
			"keyTwo": 2
		}
	}'
```

or,

```bash
curl -X POST -H "Content-Type: application/json" \
    -d '{"name": "linuxize", "email": "linuxize@example.com"}' \
    https://example/contact
```

Or with a JSON file,

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  --data @.folder/file.json \
  http://localhost:8080/ui/webapp/conf
```

### With a form

```jsx
<form method="POST" enctype='multipart/form-data' action="upload.cgi">
  <input type=file name=upload>
  <input type=submit name=press value="OK">
</form>

<!-- POST with file upload
-F = --form
-->
curl -F upload=@/home/user/Pictures/wallpaper.jpg -F press=OK [URL]
```


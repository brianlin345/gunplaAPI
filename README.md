# gunplaAPI
This is a REST API containing information on HG Gunpla model kits.

## Information
This API is written as a REST API, with appropriate routes for creating, editing, updating, and deleting entries.
All requests should be made under the /gunpla URL directory.

## Request types
### GET
For all entries, use a GET request with the `/gunpla` endpoint.   
For a entry with a specific numerical id, use the `/gunpla/[id]` endpoint with a valid entry id.  
Searching is possible by kit name and release time using query string parameters.  
Kit name searching is done with `/gunpla/?name=[name]`.  
Release date searching is done with `/gunpla/?date=[date]`.  

### POST
To add a new entry, use a POST request with the `/gunpla` endpoint.  
All parameters must be specified in the body for a new gunpla entry under the following names: 
* name, series, height, manufacturer, price, and release time.  

### PUT
To update an existing entry, use a PUT request, specifying a valid entry id with the `/gunpla/[id]` endpoint.  
All parameters must be specified in the body for a new gunpla entry under the following names:  
* name, series, height, manufacturer, price, and release time.  

### DELETE
To delete a given entry, use a DELETE request, specifying a valid entry id with the `/gunpla/[id]` endpoint.

## Sample Response
All responses are returned as a JSON object, with the number of returned entries included for search-based GET requests.<br>
An example of a single entry:  
```
{"data":  
{"name":"RX-0 Unicorn Gundam",  
"series":"Mobile Suit Gundam Unicorn",  
"height":19.7,  
"manufacturer":"Anaheim Electronics",  
"price":"¥1,500",  
"release":"2009 November"}}
```    
An example of a request returning multiple entries:  
```
{"results":2,  
"data":[{"name":"RGM-96X Jesta",  
"series":"Mobile Suit Gundam Unicorn",  
"height":19.3,  
"manufacturer":"Anaheim Electronics",  
"price":"¥1,600",  
"release":"2011 September"},  
{"name":"RGM-96X Jesta Cannon",  
"series":"Mobile Suit Gundam Unicorn",  
"height":19.3,  
"manufacturer":"Anaheim Electronics",  
"price":"¥2,000",  
"release":"2013 February"}]}
```

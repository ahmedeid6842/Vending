![logo-no-background](./vending-logo/svg/logo-no-background.svg)


<h1 align="center">Vending</h1>

This API provides endpoints for a vending machine that is accessible to both buyers and sellers. The API includes endpoints for adding, updating, and removing products, as well as depositing coins and making purchases. Authentication and authorization are used to control access to the endpoints based on user role (buyer or seller), and caching is implemented to improve performance. The API requires authentication tokens for requests that require a specific role (buyer or seller), and uses a time-to-live (TTL) value to cache frequently-requested queries.


<p align="center">
  <a href="#requirements">Requirements</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#authors">Authors</a> •
  <a href="#lessons-learned">Lessons Learned</a>
</p>

## Requirements
<p>
 <a href="https://skillicons.dev">
        <img src="https://skillicons.dev/icons?i=nodejs,mongodb,postman,redis&theme=light"/>
    </a>
    <a href="https://www.npmjs.com/"><img src="https://authy.com/wp-content/uploads/npm-logo.png" width="50px" height="50"/></a>
 
 ### OR
 <a href="https://skillicons.dev">
        <img src="https://skillicons.dev/icons?i=docker&theme=light"/>
    </a>
    <a href="https://docs.docker.com/compose/"><img src="https://gitlab.developers.cam.ac.uk/uploads/-/system/project/avatar/4542/compose.png" width="50px" height="50"/></a>
 </p>


## Environment Variables

`PORT` : port where you application start on it <number>

`ACCESS_TOKEN_SECRET` : string, access token secret <string>

`MONGODB_URI` : string, mongo database uri <string>

`SALT_WORK_FACTOR` : number of rounds to create salt for hashing<number>

## Installation

Install using docker compose 
```bash
  docker-compose build
  docker-compose up -d
```

Install  using npm
```bash
  npm install
  npm run dev #if your are a developer 
  npm run start
```
    
## Usage
Import this [JSON file](Vending.postman_collection.json) into Postman, and you will be able to use all REST APIs.

If you don't know how to do it, watch this [video](https://www.youtube.com/watch?v=bzquMXmCLUQ).

----------------
If you would like to import data to mongo collection you will data at this directory [Import Directory](./import/)

## API Reference

### 1. user/ 

#### •  Register
```http
  POST register/
```
| Request Body | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `userName`      | `string` | **Required** .user's name    |
| `password`   | `string` | **Required** .user's password |
| `role`   | `string` | **Required** .user's role at vending "buyer or seller" |

| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| ! `isLoggedIn` | `middleware`| **Required** you shouldn't be logged in|

#### • Login
```http
  POST login/
```
| Request Body | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `userName`      | `string` | **Required** .user's name    |
| `password`   | `string` | **Required** .user's password |

| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| ! `isLoggedIn` | `middleware`| **Required** you shouldn't be logged in|

#### • Logout
```http
  GET logout/
```
| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| `isAuthenticated` | `middleware`| **Required** you must be logged in to logout |

#### • Get current user
```http
  GET /
```
| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| `isAuthenticated` | `middleware`| **Required** you must be logged in to get your profile |

#### • update current user
```http
  PUT /
```
| Request Body | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `userName`      | `string` | **Required** .user's name    |
| `password`   | `string` | **Required** .user's password |
| `role`   | `string` | **Required** .user's role at vending "buyer or seller" |

| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| `isAuthenticated` | `middleware`| **Required** you must be logged in to update you profile |

#### • delete current user
```http
  DELETE /
```
| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| `isAuthenticated` | `middleware`| **Required** you must be logged in to delete you profile |


### 2. product/ 

#### •  create product
```http
  POST /
```
| Request Body | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `name`      | `string` | **Required** .product's name    |
| `cost`   | `number` | **Required** .product's cost |
| `amountAvailable`   | `number` | **Required** . products's amount available in vending machine |

| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
|  `isAuthenticated` | `middleware`| **Required** you must be logged in to add new product|
|  `role` | `middleware`| **Required** your role must be seller to add new product|


#### •  get product
```http
  GET /
```
| Request Query | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `page`      | `number` | **Required** . page number of returned prodcut "this for pagination "    |
| `name`   | `string` | **Optional** .product's name you want to get |
| `cost`   | `number` | **Optional** . products's cost you want to get |
| `sellerID`   | `string` | **Optional** get all products for specific seller  |

#### •  Get product
```http
  GET /
```
| Request Query | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `page`      | `number` | **Required** . page number of returned prodcut "this for pagination "    |
| `name`   | `string` | **Optional** .product's name you want to get |
| `cost`   | `number` | **Optional** . products's cost you want to get |
| `sellerID`   | `string` | **Optional** get all products for specific seller  |

#### •  Update product
```http
  PUT /:productID
```
| Request parameters | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `productID`      | `string` | **Required** . ID of product you want to update"    |

| Request Body | Type     | Description                   |
| :--------    | :------- | :------------------------    |
| `name`      | `string` | **Optional** .product's name    |
| `cost`   | `number` | **Optional** .product's cost |
| `amountAvailable`   | `number` | **Optional** . products's amount available in vending machine |

| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
|  `isAuthenticated` | `middleware`| **Required** you must be logged in to update  product|
|  `role` | `middleware`| **Required** your role must be seller to add new product|
| `owner` | | **Required** your must owner of the product to update it|


#### •  Delete product
```http
  DELETE /:productID
```
| Request parameters | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `productID`      | `string` | **Required** . ID of product you want to update"    |

| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| `isAuthenticated` | `middleware`| **Required** you must be logged in to delete product|
|  `role` | `middleware`| **Required** your role must be seller to add new product|
| `owner` | | **Required** your must owner of the product to update it|


### 2. payment/ 

| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| `isAuthenticated` | `middleware`| **Required** you must be logged in to do payment|
|  `role` | `middleware`| **Required** your role must be buyer to do payment|

#### •  deposit money to user balance
```http
  POST /deposit
```
| Request Body | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `amount`      | `number` | **Required** .amount of money want to deposit should only be [ 5, 10, 20, 50, 100 ]   |

#### •  buy something & make order
```http
  POST /buy
```
| Request Body | Type     | Description                   |
| :--------    | :------- | :-------------------------    |
| `productsIDs`      | `array` | **Required** . array of products IDs you want to buy  |
| `quantites`      | `array` | **Required** . array of quantites for each product you want to buy 'quantites[0] is quantity for productsIDs[0]' |

| Constraints       | Type        | Description                   |
| :--------         | :-------    | :-------------------------    |
| `prodcutExist` | `middleware`| **Required** all products IDs should be exist and the prodcut quantity is available|
| `balance` | ``| **Required** you balance should cover order total cost|

#### •  reset you deposit
```http
  PUT /reset
```

## Contributing

<h4> Always feel free to Contribute, and vending will give you somthing for free 😅. </h4> 

<div align="center">
<img src="https://user-images.githubusercontent.com/57197702/231924653-6aca39c0-1dc3-4bf0-add1-68db033f36ac.gif"/>
</div>

## Authors

- [@AhmedEid](https://github.com/ahmedeid6842/)

    
## Lessons Learned
- handle edge cases
- Build a strong authorization authentication 
- There is always something new to learn 👨‍💻.

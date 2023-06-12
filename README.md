<a name="readme-top"></a>

![logo-no-background](./vending-logo/svg/logo-no-background.svg)


<h1 align="center">Vending Machine API</h1>
<p align="center">
This API provides endpoints for a vending machine that is accessible to both buyers and sellers. The API includes endpoints for adding, updating, and removing products, as well as depositing coins and making purchases. Authentication and authorization are used to control access to the endpoints based on user role (buyer or seller), and caching is implemented to improve performance. The API requires authentication tokens for requests that require a specific role (buyer or seller), and uses a time-to-live (TTL) value to cache frequently-requested queries.
</p>

<p align="center">

  [![Contributors][contributors-shield]][contributors-url] [![Stargazers][stars-shield]][stars-url] [![Issues][issues-shield]][issues-url] [![MIT License][license-shield]][license-url] [![LinkedIn][linkedin-shield]][linkedin-url]

</p>

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Live Demo](#live-demo)
- [💻 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
  - [Run tests](#run-tests)
  - [Deployment](#deployment)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)

# 📖 Vending <a name="about-project"></a>
## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Server</summary>

  [![Node][Node.js]][Node-url] [![Express][Express.js]][Express-url] [![JWT][JWT]][JWT-url] [![NPM][NPM]][NPM-url] 
</details>

<details>
<summary>Database</summary>

  [![MongoDB][MongoDB]][MongoDB-url] [![Redis][Redis]][Redis-url] 
</details>

<details>
<summary>DevOps</summary>

  [![Docker][Docker]][Docker-url] [![Docker Compose][Docker Compose]][Docker Compose-url] 
</details>

<details>
<summary>Docs</summary>

  [![Postman][Postman]][Postman-url] [![Swagger][Swagger]][Swagger-url] 
</details>

### Key Features <a name="key-features"></a>


- [x] **Uses authentication and authorization to control access based on user role.**
- [x] **Validates requests with Joi and supports CRUD operations for products, coins, purchases, and charges.**
- [x] **Allows admins to create machines at specific locations and add products.**
- [x] **Supports geolocation to find the nearest machine or product.**
- [x] **Implements caching for improved performance using Redis.**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started <a name="getting-started"></a>
To get a local copy up and running, follow these steps.

### Prerequisites
In order to run this project you need:

<p>
 <a href="https://skillicons.dev">
        <img src="https://skillicons.dev/icons?i=nodejs,mongodb,postman,redis&theme=light"/>
    </a>
    <a href="https://www.npmjs.com/"><img src="https://authy.com/wp-content/uploads/npm-logo.png" width="50px" height="50"/></a>
 
 ##### OR
 <a href="https://skillicons.dev">
        <img src="https://skillicons.dev/icons?i=docker&theme=light"/>
    </a>
    <a href="https://docs.docker.com/compose/"><img src="https://gitlab.developers.cam.ac.uk/uploads/-/system/project/avatar/4542/compose.png" width="50px" height="50"/></a>
 </p>

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` : port where you application start on it <number>

`ACCESS_TOKEN_SECRET` : string, access token secret <string> (Example: JwtKey)

`MONGODB_URI` : string, mongo database uri <string> ( Example: mongodb://127.0.0.1/vending).

`REDIS_HOST` : string, redis database host ( Example: localhost ).

`REDIS_PORT` : number, redis working port (Example: 6379)

`SALT_WORK_FACTOR` : number of rounds to create salt for hashing<number> ( Example: 10 )

### Setup

Clone this repository to your desired folder:
 
 ```bash
 cd my-folder
 git clone https://github.com/ahmedeid6842/Vending.git
```

### Install
Install this project with **NPM**:

 ```bash
 npm install
```

Install this project with **Docker-compose**:
```bash
  docker-compose build
```

### Usage

- To run the project using **NPM**: 
```bash
  npm start
  npm run dev #if your are a developer 
```
- To run the project using **Docker-compose**: 
```bash
  docker-compose up -d
```
<hr>

> After following the above steps you can now use Vending API

Open Postman and access the REST APIs throught https://localhost:{port}/ 
![postman-url](./screenshots/postman-url.png)

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


[contributors-shield]: https://img.shields.io/github/contributors/ahmedeid6842/Vending.svg?style=for-the-badge
[contributors-url]: https://github.com/ahmedeid6842/Vending/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ahmedeid6842/Vending.svg?style=for-the-badge
[forks-url]: https://github.com/ahmedeid6842/Vending/network/members
[stars-shield]: https://img.shields.io/github/stars/ahmedeid6842/Vending.svg?style=for-the-badge
[stars-url]: https://github.com/ahmedeid6842/Vending/stargazers
[issues-shield]: https://img.shields.io/github/issues/ahmedeid6842/Vending.svg?style=for-the-badge
[issues-url]: https://github.com/ahmedeid6842/Vending/issues
[license-shield]: https://img.shields.io/github/license/ahmedeid6842/Vending.svg?style=for-the-badge
[license-url]: https://github.com/ahmedeid6842/vending/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/ahmed-eid-0018571b1/

[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en


[Express.js]:https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/

[JWT]:https://img.shields.io/badge/JWT-0072bb?style=for-the-badge&logo=json-web-tokens&logoColor=b437ce
[JWT-url]: https://jwt.io/


[Cookies]:https://img.shields.io/badge/Cookies-FFA500?style=for-the-badge&logo=🍪&logoColor=white
[Cookie-url]: https://en.wikipedia.org/wiki/HTTP_cookie

[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/

[Redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/

[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/

[Docker Compose]:https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker Compose-url]: https://docs.docker.com/compose/


[Postman]: https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white
[Postman-url]: https://www.postman.com/

[Swagger]:https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black
[Swagger-url]: https://swagger.io/

[NPM]: https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white
[NPM-url]: https://www.npmjs.com/
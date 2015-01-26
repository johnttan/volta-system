#Volta Energy-System
[![Circle CI](https://circleci.com/gh/teamvolta/volta-system/tree/dev.svg?style=svg)](https://circleci.com/gh/teamvolta/volta-system/tree/dev)

A smart grid management system with dynamic energy pricing that enables customers to trade green energy in local markets.

[Volta Energy-System](https://github.com/teamvolta/volta-system) represents the smart grid system model that manages energy levels and pricing bewtween consumers and producers within the [Volta Energy system](https://github.com/teamvolta). 

Also see: 
* [Volta Energy-Consumer](https://github.com/teamvolta/volta-consumer)
* [Volta Energy-Producer](https://github.com/teamvolta/volta-producer)

##Table of Contents

1. [Team](#team)
2. [Deployment](#deployment)
3. [Development](#development)
    1. [Requirements](#requirements)
    2. [Installing Dependencies](#installing-dependencies)
    3. [Distributive System Tool](#distributive-system-tool)
    4. [Roadmap](#roadmap)
4. [How it works](#how it works)

##Team

* Product Manager: [Anastasia Zotova](https://github.com/azotova)
* Technical Lead: [John Tan](https://github.com/johnttan)
* Scrum Master: [Michael Lom](https://github.com/mlom)
* Development Team: [Nikhil Ballaney](https://github.com/NBallaney)

##Deployment
To see a deployed version of the Volta Energy system, please visit the following:
* [Volta Energy-System Dashboard](http://voltaenergy.io)
* [Volta Energy-Consumer Dashboard](http://consumer1.azurewebsites.net/dashboard)
* [Volta Energy-Producer Dashboard](http://producer1.azurewebsites.net/#/)

##Development

###Requirements
* Node.js

###Installing Dependencies

From within the root directory:

```
npm install
```

###Distributive System Tool
The Volta Energy system requires running multiple servers for each [consumer](https://github.com/teamvolta/volta-consumer), [system](https://github.com/teamvolta/volta-system) and [producer](https://github.com/teamvolta/volta-producer) model. To assist running multiple servers simultaneously, please refer to [Distributive System Tool](https://github.com/teamvolta/distmanager).

### Roadmap

View the project roadmap [here](https://github.com/teamvolta/volta-system/issues).

##How it works

###Economic model

There are three kinds of agents in our electric power management system:

- households that both consume electric power and produce solar energy
- traditional power plants
- two intermediaries: the broker that manages the trade among households and the system operator that sets the market clearing price and determines the output of traditional power plants

The system operator receives the data on consumers’ demand and the costs and capacities of power plants and uses this information to find the market clearing price.  Then households trade with the grid and the system issues production orders to the power plants.


###Architecture

Each agent (a house, a powerplant) has a server. The servers communicate through WebSockets. The front-end interface shows the dynamics of market price, electricity consumption and production in real time.

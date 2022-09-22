# Affiliates Commission Service

The VTEX Affiliates Commission Service app is responsible for converting and provide the commission values based on the purchases made with the affiliates ID related.

## 🚀 Getting started

These instructions will allow you to get a copy of the running project on your local machine for the purposes of querying the vtex api and integrating with app **Affiliates Commission Service**.

## 🔧 Installation

To start the installation, you need to clone the GitLab project into a directory of your choice:


```
 cd "directory of your choice"
```

SSH clone 
```
 git clone git@github.com:vtex/affiliates-commission-service.git
```
or

HTTPS clone
```
  git clone https://github.com/vtex/affiliates-commission-service.git
```

Once the clone is done, now let's login, create the workspace and get it running in the store.
Tip: whenever you login, always check the 'manifest.json' file to get the correct name of the store.

### Login and access the store

Access the project folder in terminal / cmd
```
  cd "saved directory"
  vtex login youraccount
```

### Check VTEX account and workspace

To verify the VTEX account and workspace in use, just type

```
  vtex whoami
```

### Creating your workspace in the store

```
  vtex use 'vtex000'
  (by default, we use jira task number vtex000 without spaces and hyphen).
```

### Link your workspace in the store

```
  vtex link vtex000
  (which would be your ws id)
```

### Start your workspace in the store

  The server will start up in your WS environment just log in

```
https://vtex000--yourstore.myvtex.com
```

## 🛠️ Built with

* [Node](https://nodejs.org/en/docs/)
* [Typescript](https://www.typescriptlang.org/docs/)
* [GraphQl](https://graphql.org/code/#javascript)

## 📌 Version

 Please note the changelog file and tags in this repository (https://github.com/vtex/affiliates-commission-service/blob/feature/S2BRFPA-960-export/CHANGELOG.md) 

## ✒️ Authors

* **Gabriel Eluan** - *Developer* - [Gabriel Eluan](https://github.com/gabEluan)
* **Gabriel Hosino** - *Developer* - [Gabriel Hosino](https://gitlab.com/gabrielHosino)
* **Matheus Izidio** - *Developer* - [Matheus Izidio](https://gitlab.com/MIzidio)
* **Gabriel Barros** - *Developer* - [Gabriel Barros](https://gitlab.com/GabrielBarross)

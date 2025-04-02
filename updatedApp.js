const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwttoken = require('jsonwebtoken')

let db = null

const app = express()

app.use(express.json())
const dbpath = path.join(__dirname, 'covid19IndiaPortal.db')

const connection = async () => {
  try {
    db = await open({filename: dbpath, driver: sqlite3.Database})
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000...')
    })
  } catch (e) {
    console.log('connection error : ' + e)
    process.exit(1)
  }
}

connection()

const check = (req, res, next) => {
  let jwt
  const header = req.headers['authorization']
  if (header) {
    jwt = header.split(' ')[1]
  }
  if (!jwt) {
    return res.status(401).send('Invalid JWT Token')
  }
  jwttoken.verify(jwt, 'secretkey', async (err, payload) => {
    if (err) {
      res.status(401).send('Invalid JWT Token')
    } else {
      //console.log('correct jwt token')
      next()
    }
  })
}

app.post('/login/', async (req, res) => {
  const {username, password} = req.body

  try {
    const api1 = `SELECT * FROM user WHERE username = '${username}';`
    const user = await db.get(api1)

    if (user === undefined) {
      res.status(400)
      res.send('Invalid user')
    } else {
      const ispasswordright = await bcrypt.compare(password, user.password)
      if (!ispasswordright) {
        res.status(400)
        res.send('Invalid password')
      } else {
        const payload = {
          username: username,
        }
        const token = jwttoken.sign(payload, 'secretkey')
        res.send({token})
      }
    }
  } catch (e) {
    console.log('Internal error : ' + e)
  }
})

app.get('/states/', check, async (req, res) => {
  try {
    const api2 = `SELECT * FROM state;`
    const ans = await db.all(api2)
    const result = ans.map(eachItem => ({
      stateId: eachItem.state_id,
      stateName: eachItem.state_name,
      population: eachItem.population,
    }))
    res.send(result)
  } catch (e) {
    console.log('get api error : ' + e)
  }
})

app.get('/states/:stateId/', check, async (req, res) => {
  const {stateId} = req.params
  try {
    const getStateQuery = `
  SELECT * FROM state WHERE state_id = ${stateId};`
    const result = await db.get(getStateQuery)
    res.status(200).send({
      stateId: result.state_id,
      stateName: result.state_name,
      population: result.population,
    })
  } catch (e) {
    console.log('get api error : ' + e)
  }
})

app.post('/districts/', check, async (req, res) => {
  const {districtName, stateId, cases, cured, active, deaths} = req.body
  try {
    const addNewUserQuery = `
    INSERT INTO district (district_name, state_id, cases, cured, active, deaths)
    VALUES ('${districtName}',${stateId}, ${cases}, ${cured}, ${active}, ${deaths});`
    await db.run(addNewUserQuery)
    res.status(200).send('District Successfully Added')
  } catch (e) {
    console.log('post api error: ' + e)
  }
})

app.get('/districts/:districtId/', check, async (req, res) => {
  const {districtId} = req.params
  try {
    const getDistrictQuery = `
    SELECT * FROM district WHERE district_id = ${districtId};`
    const result = await db.get(getDistrictQuery)
    res.status(200).send({
      districtId: result.district_id,
      districtName: result.district_name,
      stateId: result.state_id,
      cases: result.cases,
      cured: result.cured,
      active: result.active,
      deaths: result.deaths,
    })
  } catch (e) {
    console.log('get api error: ' + e)
  }
})

app.delete('/districts/:districtId/', check, async (req, res) => {
  const {districtId} = req.params
  try {
    const deleteDistrictQuery = `
    DELETE FROM district WHERE district_id = ${districtId};`
    await db.run(deleteDistrictQuery)
    res.send('District Removed')
  } catch (e) {
    console.log('get api error: ' + e)
  }
})

app.put('/districts/:districtId', check, async (req, res) => {
  const {districtId} = req.params
  const {districtName, stateId, cases, cured, active, deaths} = req.body
  try {
    const updateDistrictQuery = `
    UPDATE district 
    SET district_name = '${districtName}', state_id = ${stateId}, cases=${cases}, cured=${cured}, active=${active}, deaths=${deaths}
    WHERE district_id = ${districtId}`
    await db.run(updateDistrictQuery)
    res.send('District Details Updated')
  } catch (e) {
    console.log('post api error: ' + e)
  }
})

app.get('/states/:stateId/stats/', check, async (req, res) => {
  const {stateId} = req.params
  try {
    const getStatsQuery = `
    SELECT SUM(cases) AS totalCases, SUM(cured) AS totalCured, SUM(active) AS totalActive, SUM(deaths) AS totalDeaths
    FROM district
    WHERE state_id = ${stateId};`
    const result = await db.get(getStatsQuery)
    res.status(200).send(result)
  } catch (e) {
    console.log('get api error: ' + e)
  }
})

module.exports = app

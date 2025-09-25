
const { response } = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')

module.exports = {
  doSignup: (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rules = {
        Name: { label: 'Name', required: true },
        Email: { label: 'Email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: "Enter valid Email" },
        Password: { label: 'Password', required: true, minLength: 6 },
        Mobile: { label: 'Mobile', required: true, pattern: /^[6-9]\d{9}$/, patternMsg: 'Mobile number must be a valid 10-digit number starting with 6–9' }
      };

      let missingField = [];

      for (let field in rules) {
        let value = userData[field];
        let rule = rules[field];

        if (rule.required && (!value || value.trim() === '')) {
          missingField.push(rule.label);
        } else if (rule.minLength && (value.length < rule.minLength)) {
          return resolve({ status: false, message: `${rule.label} must be at least ${rule.minLength} characters` });
        } else if (rule.pattern && !rule.pattern.test(value)) {
          return resolve({ status: false, message: rule.patternMsg || `${rule.label} is invalid` });
        }
      }

      // check after loop
      if (missingField.length > 0) {
        return resolve({ status: false, message: `Please Enter ${missingField.join(', ')}` });
      }

      userData.Password = await bcrypt.hash(userData.Password, 10);
      console.log('trying to save');
      const user = new User(userData);
      let newUser = await user.save();

      if (newUser) {
        console.log('user created');
        return resolve({ status: true, newUser });
      } else {
        return resolve({ status: false, message: 'Signup failed, please try again' });
      }
    } catch (err) {
      console.error(err);
      return reject(err);
    }
  });
},

  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      const rules = {
        Email: { label: 'Email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: "Enter valid Email" },
        Password: { label: 'Password', required: true, minLength: 6 },
        Mobile: { label: 'Mobile', required: true, pattern: /^[6-9]\d{9}$/g, patternMsg: 'Mobile number must be a valid 10-digit number starting with 6–9' }
      }
      let missingField = [];
      for (let field in rules) {
        let value = userData[field];
        let rule = rules[field];
        if (rule.required && (!value || value.trim() === '')) {
          missingField.push(rule.label);
        } else if (rule.minLength && (value.length < rule.minLength)) {
          return resolve({ status: false, message: `${rule.label} must be atleast ${rule.minLength} characters` })
        } else if (rule.pattern && !rule.pattern.test(value)) {
          return resolve({ status: false, message: rule.patternMsg || `${rule.label} is invalid` });
        }

        if (missingField.length > 0) {
          return resolve({ status: false, message: `Please Enter ${missingField.join(', ')}` })
        }
      }


      let user = await User.findOne({ Email: userData.Email })
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            resolve({ user: user.Name, status: true })
          } else {
            resolve({ status: false, message: 'Password is incorrect' })
          }
        })
      } else {
        resolve({ status: false, message: 'User not found' })
      }
    })
  }
}
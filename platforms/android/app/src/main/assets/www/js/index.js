/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db;
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById('loginbtn').addEventListener('click', this.validate);
    },
    
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        
        document.addEventListener('deviceready', function () {
            db = window.sqlitePlugin.openDatabase({
                name: 'my.db',
                location: 'default',
            });
        });

        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS users (email, password, name, dateborn)');
        }, function (error) {
            console.log('Transaction ERROR: ' + error.message);
        }, function () {
            console.log('Populated database OK');
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    validate: function (){
        let validUser = false;
        let validPassword = false;
        let email = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        db.transaction(function (tx) {
            tx.executeSql('SELECT count(email) AS mycount FROM users WHERE email=?', [email], function(tx, rs) {
                if(rs.rows.item(0).mycount == 1){
                    validUser = true;
                }
            }, function (tx, error) {
                alert('SELECT error: ' + error.message);
            });
            if(validUser){
                tx.executeSql('SELECT count(password) AS mycount FROM users WHERE password=?', [password], function(tx, rs) {
                    if(rs.rows.item(0).mycount == 1){
                        validPassword = true;
                    }
                }, function (tx, error) {
                    alert('SELECT error: ' + error.message);
                });
            }
        });
        if(validUser && validPassword){
            window.location.href = "home.html"
        }
        else{
            alert("Usuário ou senha inválido");
        }

    }
};

app.initialize();
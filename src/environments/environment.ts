// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebaseConfig = {
  apiKey: 'AIzaSyBKwCBfSAa8m501IqOe4N95-n8XpnsCsYk',
  authDomain: 'report-generator-ca120.firebaseapp.com',
  databaseURL: 'https://report-generator-ca120.firebaseio.com',
  projectId: 'report-generator-ca120',
  storageBucket: 'report-generator-ca120.appspot.com',
  messagingSenderId: '694099181675',
  appId: '1:694099181675:web:52ab5d2d0302a11050312e',
  measurementId: 'G-GN524RPSZ7'
};

export const environment = {
  production: false,
  firebase: firebaseConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

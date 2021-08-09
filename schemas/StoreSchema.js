'use strict'

const REQUIRED = { required: true }

const STRING_REQUIRED = {
  ...REQUIRED,
  type: String
}

const NUMBER_REQUIRED = {
  ...REQUIRED,
  type: Number
}

const SCHEMA = {
  uuid                : STRING_REQUIRED,
  sapStoreID          : Number,
  street              : STRING_REQUIRED,
  street2             : String,
  street3             : String,
  postalCode          : String,
  city                : STRING_REQUIRED,
  addressName         : STRING_REQUIRED,
  locationType        : STRING_REQUIRED,
  latitude            : NUMBER_REQUIRED,
  longitude           : NUMBER_REQUIRED,
  location            : [],
  complexNumber       : String,
  showWarningMessage  : Boolean,
  todayOpen           : String,
  todayClose          : String,
  collectionPoint     : Boolean
}

module.exports = SCHEMA
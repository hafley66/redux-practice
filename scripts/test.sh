#!/usr/bin/env bash
shopt -s globstar
mocha $TEST_FOLDER/**/*.spec.js $TEST_FOLDER/**/spec/*.js "$@"

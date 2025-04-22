#!/bin/bash

eval $(ssh-agent -s);
ssh-add ~/.ssh/taggingmon_rsa;
ssh -T git@github.com;
#!/usr/bin/env bash

shell_env="$SHELL"
henesis="$(henesis autocomplete:script)"

if [[ "${shell_env}"=="/bin/zsh" ]]; then
    cat_for_zsh=`cat ~/.zshrc`

    if [[ "${cat_for_zsh}" != *"${henesis}"* ]]; then
        printf "$(henesis autocomplete:script zsh)" >> ~/.zshrc; source ~/.zshrc
    fi
fi

if [[ "${shell_env}"=="/bin/bash" ]]; then
    cat_for_bash=`cat ~/.bashrc`

    if [[ "${cat_for_bash}" != *"${henesis}"* ]]; then
        printf "$(henesis autocomplete:script bash)" >> ~/.bashrc; source ~/.bashrc
    fi
fi
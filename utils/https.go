// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

package utils

import (
	"net/http"
  "fmt"
)

type HTTPS struct {
	handler http.Handler
}

func NewHTTPS(handler http.Handler) *HTTPS {
	return &HTTPS{
		handler: handler,
	}
}

func (st *HTTPS) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	
  if r.Header.Get("X-Forwarded-Proto") == "http" {
      redirectURL := fmt.Sprintf("https://%s%s", r.Host, r.RequestURI)
      w.Header().Add("Location", redirectURL)
      w.WriteHeader(301)
      w.Write([]byte(nil))
  } else {
		st.handler.ServeHTTP(w, r)
	}
}

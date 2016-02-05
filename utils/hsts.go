// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

package utils

import (
	"fmt"
	"net/http"
)

type HSTS struct {
	headerValue string
	handler     http.Handler
}

func NewHSTS(handler http.Handler, maxAge int, includeSubDomains bool) *HSTS {
	return &HSTS{
		handler:     handler,
		headerValue: fmt.Sprintf("max-age=%d; %t", maxAge, includeSubDomains),
	}
}

type Handler interface {
	ServeHTTP(http.ResponseWriter, *http.Request)
}

func (st *HSTS) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Strict-Transport-Security", st.headerValue)
	st.handler.ServeHTTP(w, r)
}

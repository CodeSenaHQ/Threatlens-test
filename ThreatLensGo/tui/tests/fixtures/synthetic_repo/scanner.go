package main

import (
	"fmt"
	"os"
)

type SeverityLevel string

type ScanConfig struct {
	TargetDirectory string
	MaxWorkers      int
}

type VulnerabilityReporter interface {
	ReportFinding(severity SeverityLevel, description string) error
}

type CodeScanner struct {
	config ScanConfig
	status string
}

func NewScanner(cfg ScanConfig) *CodeScanner {
	return &CodeScanner{
		config: cfg,
		status: "idle",
	}
}

func (s *CodeScanner) Scan(target string) error {
	fmt.Fprintf(os.Stdout, "Scanning target: %s\n", target)
	s.status = "done"
	return nil
}

func (s *CodeScanner) GetStatus() string {
	return s.status
}

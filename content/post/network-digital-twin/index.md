---
title: "Network digital twin: monitoring and automation"
description: "Monitoring and Ansible automation layer of a team project presented to a jury."
date: 2026-05-28
slug: network-digital-twin
categories: [Projects]
tags: [monitoring, grafana, prometheus, ansible, netbox, gns3]
---

A team project (5 students) that mirrors a GNS3 enterprise network with a monitoring stack. I built the monitoring and automation layer on a dedicated Ubuntu VM.

- Telegraf polls Cisco L3 devices over SNMP every 60 seconds into InfluxDB, shown in Grafana panels for CPU, interface status, inbound traffic and errors.
- A systemd service syncs the GNS3 topology (18 devices) into NetBox, the inventory source of truth.
- Five Ansible playbooks run daily from cron across 6 targets (Cisco IOS, Alpine firewall, monitoring VM) for config backups and state collection.
- Backup status is exposed as Prometheus metrics with a dedicated Grafana dashboard.

Source code: [GitHub](https://github.com/anisblf02)

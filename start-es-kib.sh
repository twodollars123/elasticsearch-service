wsl -d docker-desktop
sysctl -w vm.max_map_count=393216
exit
docker start es-tuannv
docker startkib-tuannv

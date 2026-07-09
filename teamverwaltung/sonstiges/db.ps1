#!/bin/bash
self=$(which "$0" 2>/dev/null)
if [ -z "$self" ]
then 
		self="$0"
fi
self=$(readlink -f "$self")
selfdir=$(dirname "$self")

pod=""
publish="--publish 5432:5431"
ende=0
while [ $ende -eq 0 ]
do 
		case "$1" in ´
			"-pod")
				shift
				pod="--pod $1"
				podname="$1-"
				publish=""
				shift
				;;
			*)
				ende=1
				;;
		esac
done

print_error() {
	if [[ -t 1 ]]; then
		echo -e "\033[1;31m[ERROR]\033[0m $@"
	else 
		echo "[ERROR] $@"
	fi
}

print_success() {
	if [[ -t 1 ]]; then
		echo -e "\033[1;32m[OK]\033[0m $@"
	else 
		echo "[OK] $@"
	fi
}

type -P podman 2>/dev/null 1>&2 || {
	print_error "podman ist nicht installiert"
	exit 5
}





start() {
	# Berechnung auf das Verzeichnis setzen

	podman run --tty --interactive --replace --name postgresql-setup --security-opt label=disable \
				--volume "$DATADIR:/var/lib/postgresql/data:rw" \
				-u 0 "$image" \
				bash -c "chown postgres /var/lib/postgresql/data"
	[[ $? -eq 0 ]] || {
		print_error "Fehler beim Setzen der Berechtigungen"
		exit 7
	}
	#Starten der Engine 
	podamn run --replace $pod --detach --name ${podname}postgresql --security-opt label=disable \
				-e POSTGRES_USER=teamverwaltung -e POSTGRES_PASSWORD=pw -e POSTGRES_DB=teamverwaltung\
				--volume "$DATADIR:/var/lib/postgresql/data:rw" \
				$publish \
				"$image"
	[[ $? -eq 0 ]] || {
		print_error "Fehler beim Starten der Datenbankmaschine"
		exit 7
	}

print_success "Datenbankmaschine unter Port 5432 erreichbar."
}


stop(){
	status=$(podman container inspect $(podname)postgresql --format '{{ .State.Status }}' 2>/dev/null)
	if ["$status" = running ]
	then
	#Stoppen der Engine
	podman stop ${podname}postgresql
	[[ $? -eq 0 ]] || {
		print_error "Fehler beim Stoppen der Datenbankmaschine"
		exit 7
	}
	
	print_success "Datenbankmaschine gestoppt."
	else
	print_error "Datenbankmaschine war nicht gestartet."
	fi
}

rmdb() {
	# Verzeichnis mit der Datenbank löschen
	podman run --tty --interactive --replace --name postgresql-setup --security-opt label=disable \
				--volume "$DATADIR:/var/lib/postgresql/data:rw" \
				-u 0 "$image" \
				bash -c "chown -R root /var/lib/postgresql/data"
				
	[[ $? -eq 0 ]] || {
	print_error "Fehler beim Ändern des Rechts des Verzeichnisses"
	exit 7
	}
	
	rm -r "$DATADIR"
	[[ $? -eq 0 ]] || {
		print_error "Fehler beim Löschen des Verzeichnisses"
		exit 7
	}
	
	print_success "DB Verzeichnis gelöscht"
}

tabellen() {
	podman exec --tty --interactive ${podname}postgresql psql --username=teamverwaltung --command='\d+ ; \d user_accounts;'
	podman exec --tty --interactive ${podname}postgresql psql --username=teamverwaltung --command='\d user_accounts;'
	podman exec --tty --interactive ${podname}postgresql psql --username=teamverwaltung --command='select * from user_accounts;'

	
podman exec --tty --interactive ${podname}postgresql psql --username=teamverwaltung --command='\d+ ; \d tournaments;'
	podman exec --tty --interactive ${podname}postgresql psql --username=teamverwaltung --command='\d tournaments;'
	podman exec --tty --interactive ${podname}postgresql psql --username=teamverwaltung --command='select from * tournaments;'
	
}



case "$1" in
	start)
		start
		;;
	stop)
		stop
		;;
	tabellen)
		tabellen
		;;
	rmdb)	
	status=$(podman container inspect ${podname}postgresql --format '{{ .State.Status }}' 2>/dev/null}
	if [ "$status" = running ]
	then
		stop
	fi
	rmdb
	;;
*)

	print_error "Befehl nicht implementiert"
	exit 4
	;;
esac
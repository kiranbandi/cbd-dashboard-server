for f in *.log
do
	cp -v "$f" longterm_log_store/"${f%.log}"$(date +%m%d%y).log
done

> server-activity.log
> server-combined.log

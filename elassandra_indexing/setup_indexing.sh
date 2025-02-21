for setupIndex in ./elassandra_indexing/setup_*_indexing.sh
do
	echo "Setup $setupIndex"
	sh $setupIndex;
done

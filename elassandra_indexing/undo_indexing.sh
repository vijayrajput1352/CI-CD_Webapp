
for setupIndex in ./elassandra_indexing/undo_*_indexing.sh
do
	echo "Undo $setupIndex"
	sh $setupIndex;
done

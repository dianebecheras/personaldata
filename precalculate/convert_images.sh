imgdir=../img
datadir=../data

#print each image without

for entry in "$imgdir"/*.jpg
do
 echo "converting "$entry
 filename=$(basename -- "$entry")
 filename="${filename%.*}"

 node convert.js -i "$entry" -o "$datadir"/"$filename".json -s 100
done

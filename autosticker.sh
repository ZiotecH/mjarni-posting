#!/bin/sh
pack="mjarniposting2"
if [ $# -eq 1 ]; then
pack = $1
fi
file=`cat request`
emoji=`cat emoji`
echo $file
rm ~/.telegram-cli/state -fv
telegram-cli -W -e "msg Stickers /addsticker"
sleep .250s
telegram-cli -W -e "msg Stickers $pack"
sleep .250s
telegram-cli -W -e "send_document Stickers /mnt/c/tmp/mjarni_posting_stickers/autoproc/$file"
sleep .250s
telegram-cli -W -e "msg Stickers $emoji"
sleep .250s
telegram-cli -W -e "msg Stickers /done"
echo "Completed sending $file"
#!/usr/bin/env python3

import argparse, csv, sys, collections

from common import *

if len(sys.argv) == 1:
    sys.argv.append('-h')

parser = argparse.ArgumentParser()
parser.add_argument('-f', '--feats_path', type=str, default='freqent_feats')
parser.add_argument('-t', '--threshold', type=int, default=int(100))
parser.add_argument('csv_path', type=str)
args = vars(parser.parse_args())
counts = collections.defaultdict(lambda : [0, 0, 0])

with open(args['feats_path'], 'w') as fp:
    freqent_feats = set()
    for i, row in enumerate(csv.DictReader(open(args['csv_path'])), start=1):
        label = row['Label']
        for j in range(1, 27):
            field = 'C{0}'.format(j)
            value = row[field]
            if label == '0':
                counts[field+','+value][0] += 1
            else:
                counts[field+','+value][1] += 1
            counts[field+','+value][2] += 1
        if i % 1000000 == 0:
            sys.stderr.write('{0}m\n'.format(int(i/1000000)))

    print('Field,Value,Neg,Pos,Total,Ratio')

    for key, (neg, pos, total) in sorted(counts.items(), key=lambda x: x[1][2]):
        if total < 10:
            continue
        ratio = round(float(pos)/total, 5)
        print(key+','+str(neg)+','+str(pos)+','+str(total)+','+str(ratio))
        if(total > args['threshold']):
            fp.write(key.replace(',', '-')+'\n')

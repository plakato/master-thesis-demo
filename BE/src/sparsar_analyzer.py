# -*- coding: utf-8 -*-
from datetime import datetime
import json
import os
import re
import shlex
import random
import string
import subprocess
from os.path import join, isfile
import xml.etree.ElementTree as ET



def create_sparsar_input_file_from_song(lyrics, output_filename):
    with open(output_filename, 'w+') as output:
        output.write('Song title\n')
        output.write('by song author.\n\n')
        for i in range(len(lyrics)):
            # Get rid of semicolons and & because the punctuator deletes
            # everything following a semicolon. Get rid of invalid SPARSAR characters.
            lyrics[i] = lyrics[i].strip().replace(
                '&amp;', 'and').replace(';', ',').replace('’', "'")\
                    .replace('"', '')
            # punctuation = '.'
            # if line == '' or \
            #         line[-1] == '?' or \
            #         line[-1] == '!' or \
            #         line[-1] == '…':
            #     punctuation = ''
        punctuated_lyrics = add_punctuation(lyrics)
        for i in range(len(punctuated_lyrics)):
            output.write(punctuated_lyrics[i] + '\n')


def sparsar_process_song(lyrics):
    # Generate random name to avoid collisions.
    song_file = ''.join([random.choice(string.ascii_letters) for i in range(32)]) + '.txt'
    create_sparsar_input_file_from_song(lyrics, song_file)
    # Don't get stuck on infinite sparsar executions.
    command_line = "./bin/sparsar_man loadallouts -- \"" + song_file + "\""
    args = shlex.split(command_line)
    FNULL = open(os.devnull, 'w')
    try:
        completed = subprocess.run(args, stdout=FNULL, timeout=180)
        if completed.returncode == 0:
            print('Successfully analyzed', song_file)
            return 0
        else:
            print('Analysis of', song_file, 'failed.')
            return 1
    except subprocess.TimeoutExpired:
        print('Analysis of', song_file, 'ran too long.')
        return 1


def get_scheme_letters(inputfile):
    # Mark '&' correctly because it is sometimes used incorrectly in generated
    # xmls.
    fixed_input = []
    with open(inputfile) as input:
        for line in input:
            fixed_input.append(re.sub('&(?!amp;)',  '&amp;', line))
    try:
        root = ET.fromstringlist(fixed_input)
    except Exception as error:
        print('Failed analyzing', inputfile)
        print(error)
        return None, None

    # Parse rhyme scheme.
    # Change Prolog format into JSON to be parsed as a dictionary.
    scheme = root[2][0].attrib['Stanza-based_Rhyme_Schemes']
    scheme = scheme.replace('-', '\":\"'
                                 '').replace('[', '{\"').replace(']',
                                                                 '\"}').replace(
        ',', '\",\"')
    scheme = '{\"scheme\":' + scheme.replace('\"{', '{').replace('}"',
                                                                 '}') + '}'
    # Get rid of empty values with regex.
    scheme = re.sub('\".?\":\{\"\"\},', '', scheme)
    scheme = json.loads(scheme)
    scheme_letters = {}
    for stanza in scheme['scheme'].values():
        scheme_letters.update(stanza)
    return scheme_letters, root


def get_sparsar_phon_files_from_dir(dir):
    files = []
    names = []
    for filename in os.listdir(dir):
        if filename.endswith('_phon.xml'):
            name = filename.replace('\'', '').replace('.txt_phon.xml', '')
            files.append(filename)
            names.append(name)
    return files, names


def extract_rhymes_to_csv(path, filename, output_path):
    inputfile = path + filename
    filename = filename.replace('\'', '').replace(".txt_phon.xml", "")
    if filename.startswith('shuffled'):
        prefix = 'shuffled/'
    else:
        prefix = 'original/'
    outputfile = output_path + prefix + filename + '.csv'
    scheme_letters, root = get_scheme_letters(inputfile)
    # Analysis failed (usually invalid xml because of bugs in SPARSAR).
    if scheme_letters is None:
        return 1
    print(scheme_letters)
    # Create output.
    keys = list(scheme_letters.keys())
    scheme_letter_no = -1
    lines = []
    for stanza in root[0]:
        for line in stanza[1]:
            words = []
            phons = []
            no = int(line.attrib['no'])
            for word in line.attrib['line_syllables'].split(']'):
                if word == '':
                    continue
                parts = word.replace('[', '').split('/')
                words.append(parts[0].replace(',', ''))
                phons.append(parts[1].replace(',', '_'))
            scheme_letter_no += 1
            lines.append('{0};{1};{2};{3}\n'.format(scheme_letters[keys[scheme_letter_no]], no, ' '.join(words), ' '.join(phons)))
    os.makedirs(os.path.dirname(outputfile), exist_ok=True)
    # lines = altered_data_generator.shuffle(lines)
    # print(lines)
    with open(outputfile, 'w+') as output:
        output.write('Rhyme Scheme Letter;Line Number;Lyrics;Phonetic '
                     'Transcription\n')
        output.write(''.join(lines))
    return 0


# Takes list of verses as input.
def add_punctuation(lyrics):
    # Replace newlines with a smiley (because punctuator deletes newlines).
    to_send = '🙂'.join(lyrics)
    cmd = 'curl -d "text=' + to_send + '" http://bark.phon.ioc.ee/punctuator'
    args = shlex.split(cmd)
    # returns output as byte string
    returned_output = subprocess.run(args, check=True,
                                     stdout=subprocess.PIPE).stdout
    # using decode() function to convert byte string to string
    punctuated_lyrics = returned_output.decode("utf-8")
    # Sometimes punctuation is added after newline -> switch it around.
    punctuated_lyrics = re.sub('🙂([.?:!])', '\g<1>🙂', punctuated_lyrics)
    punctuated_lyrics = punctuated_lyrics.split('🙂')
    return punctuated_lyrics


def main():
    # Prepare files for SPARSAR.
    os.environ["PYTHONIOENCODING"] = "utf-8"
    lyrics = ['You\'ve got blue eyes', 'I\'ve got green.', 'Who\'s got brown?', 'Have you seen?']
    # Generate SPARSAR output files.
    sparsar_process_song(lyrics) 
    # Extract useful information from SPARSAR output files to .csv file.
    # path = 'sparsar_experiments/outs/'
    # output_path = 'sparsar_experiments/rhymes/'
    # # output_path = 'sparsar_experiments/line_shuffle_comparison/analyzed_before_shuffle/'
    # # path = output_path
    # total = 0
    # for item in os.listdir(path):
    #     if isfile(join(path, item)) and item.endswith('_phon.xml'):
    #         print('Extracting to csv...', item)
    #         result = extract_rhymes_to_csv(path, item, output_path)
    #         if result == 0:
    #             total += 1
    # print('Generated', total, '.csv files.')
    # end = datetime.now()
    # elapsed = end - start
    # print("Start Time =", start.strftime("%H:%M:%S"))
    # print("End Time =", end.strftime("%H:%M:%S"))
    # print("Elapsed Time =", elapsed)


if __name__ == '__main__':
    main()

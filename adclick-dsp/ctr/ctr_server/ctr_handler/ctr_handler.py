#!/bin/python3
#libctr.so wrap
from ctypes import *

ctrlib = cdll.LoadLibrary('/var/www/demoapp/ctr_handler/libctr.so')

is_init_handler = ctrlib._Z7is_initv
init_handler    = ctrlib._Z4initv
get_ctr_handler = ctrlib._Z7get_ctrPKc

get_ctr_handler.restype  = c_char_p
get_ctr_handler.argtypes = [c_char_p,]


def init():
	return init_handler

def get_ctr(string):
	return get_ctr_handler()

def is_init():
	return is_init_handler()


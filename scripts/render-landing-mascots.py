"""랜딩 그림을 Blender 원본에서 렌더한다 (2026-11 미니룸 랜딩).

다섯 마리를 **같은 키 · 같은 바닥선**으로 찍는 것이 이 스크립트의 전부다. 가만히 선 첫 프레임에서
키와 바닥을 재고, 모든 컷을 그 틀로 찍는다 — 정사각형, 키의 1.7배 화면, 발은 아래에서 10% 자리.
그래서 랜딩 CSS 는 그림의 폭만 정하면 다섯의 발이 같은 줄에 선다. 틀을 바꾸면 `globals.css` 의
캐릭터 자리 계산(바닥 = 폭의 90%)도 함께 고친다.

Blender 원본(`<동물>_2.blend`)은 저장소에 없다. 손에 있는 사람이 돌린다.

    blender -b <동물>_2.blend --python scripts/render-landing-mascots.py -- <출력 폴더> <작업들> [한 변 px]

작업은 쉼표로 잇는다.
    still:<클립>:<프레임>:<시점>:<이름>[:바닥 비율]   한 장
    seq:<클립>:<시점>:<이름>                          클립 전체를 프레임마다
시점은 front(정면) · iso(미니룸) · side · y<요>p<피치>(예: y30p40 — 엎드려 자는 모습).

seq 로 뽑은 프레임은 스프라이트 시트로 묶어 쓴다(춤 5×5 · 콕 6×6, 칸 360px). 프레임을 한 장에
묶는 이유는 `apps/web/components/MiniroomDemo.tsx` 맨 위 주석에 있다.
"""

import bpy, math, sys, os
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv = sys.argv[sys.argv.index('--') + 1:]
out, jobs = argv[0], argv[1].split(',')
size = int(argv[2]) if len(argv) > 2 else 640
name = bpy.path.basename(bpy.data.filepath).split('_')[0]
sc = bpy.context.scene
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
for o in list(bpy.data.objects):
    if o.type in ('CAMERA', 'LIGHT'):
        bpy.data.objects.remove(o)
try:
    sc.render.engine = 'BLENDER_EEVEE'
except TypeError:
    sc.render.engine = 'BLENDER_EEVEE_NEXT'
sc.render.film_transparent = True
sc.render.resolution_x = size
sc.render.resolution_y = size
sc.render.image_settings.file_format = 'PNG'
sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'Standard'
w = sc.world or bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
bg = next(n for n in w.node_tree.nodes if n.type == 'BACKGROUND')
bg.inputs[0].default_value = (1, 0.97, 0.93, 1); bg.inputs[1].default_value = 0.9

def light(nm, kind, energy, loc, rot, sz=3):
    d = bpy.data.lights.new(nm, kind); d.energy = energy
    if kind == 'AREA': d.size = sz
    o = bpy.data.objects.new(nm, d); sc.collection.objects.link(o)
    o.location = loc; o.rotation_euler = [math.radians(a) for a in rot]
light('key', 'AREA', 900, (-3, -4, 5), (40, 0, -35), 4)
light('fill', 'AREA', 300, (4, -3, 2), (70, 0, 50), 5)
light('rim', 'AREA', 500, (0, 4, 4), (-50, 0, 180), 3)

cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'
cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam

def bbox():
    lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
    dg = bpy.context.evaluated_depsgraph_get()
    for o in bpy.data.objects:
        if o.type != 'MESH' or o.hide_render: continue
        ev = o.evaluated_get(dg); m = ev.to_mesh()
        for v in m.vertices:
            p = ev.matrix_world @ v.co
            lo = Vector(map(min, lo, p)); hi = Vector(map(max, hi, p))
        ev.to_mesh_clear()
    return lo, hi

def use(clip, frame):
    if clip in bpy.data.actions:
        arm.animation_data.action = bpy.data.actions[clip]
    sc.frame_set(frame)

# 기준은 가만히 선 첫 프레임 — 키와 바닥을 여기서 재서 모든 컷에 같이 쓴다
use('idle', 0)
lo, hi = bbox()
H = hi.z - lo.z
root = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
O = H * 1.7  # 뛰거나 팔을 들어도 잘리지 않을 여유

def place(view, floor=0.10):
    if view == 'front':
        yaw, pitch = math.radians(-18), math.radians(6)
    elif view.startswith('y'):
        y_, p_ = view[1:].split('p')
        yaw, pitch = math.radians(float(y_)), math.radians(float(p_))
    elif view == 'side':
        yaw, pitch = math.radians(-62), math.radians(22)
    else:
        yaw, pitch = math.radians(-35), math.radians(28)
    c = root + Vector((0, 0, H * 0.55)); d = 12
    cam.location = c + Vector((math.sin(yaw) * math.cos(pitch) * d, -math.cos(yaw) * math.cos(pitch) * d, math.sin(pitch) * d))
    cam.rotation_euler = (math.radians(90) - pitch, 0, yaw)
    cd.ortho_scale = O; cd.shift_x = 0; cd.shift_y = 0
    bpy.context.view_layer.update()
    for _ in range(3):
        p = world_to_camera_view(sc, cam, root)
        cd.shift_x += (p.x - 0.5)
        cd.shift_y += (p.y - floor)
        bpy.context.view_layer.update()

for job in jobs:
    parts = job.split(':')
    kind = parts[0]
    if kind == 'still':
        _, clip, frame, view, tag = parts[:5]
        place(view, float(parts[5]) if len(parts) > 5 else 0.10); use(clip, int(frame))
        sc.render.filepath = os.path.join(out, f'{name}_{tag}.png')
        bpy.ops.render.render(write_still=True)
    elif kind == 'seq':
        _, clip, view, tag = parts
        place(view)
        act = bpy.data.actions[clip]
        f0, f1 = int(act.frame_range[0]), int(act.frame_range[1])
        os.makedirs(os.path.join(out, f'{name}_{tag}'), exist_ok=True)
        for f in range(f0, f1):
            use(clip, f)
            sc.render.filepath = os.path.join(out, f'{name}_{tag}', f'{f - f0:03d}.png')
            bpy.ops.render.render(write_still=True)
        print(f'SEQ {name} {clip} {f0}-{f1} fps={sc.render.fps}')
